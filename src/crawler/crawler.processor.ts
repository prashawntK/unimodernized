import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '@prisma/client';
import puppeteer, { Browser } from 'puppeteer';
import { PagesService } from 'src/pages/pages.service';
import { createHash } from 'crypto';
import { analysisQueue } from 'src/queue/queue.module';
import { enqueue } from 'src/queue/queue.helper';
import { BaseProcessor } from 'src/queue/base.processor';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParserService } from 'src/parser/parser.service';
import { BrandExtractorService } from 'src/brand/brand-extractor.service';
import { AccessibilityService } from 'src/accessibility/accessibility.service';

@Injectable()
export class CrawlerProcessor extends BaseProcessor{

    constructor(
        config: ConfigService,
        private projectsService: ProjectsService,
        private pagesService: PagesService,
        private prismaService: PrismaService,
        private parserService: ParserService,
        private brandExtractor: BrandExtractorService,
        private accessibilityService: AccessibilityService,

    ){
        super('crawl',config);
    }

    async process(job: Job){
        const {projectId} = job.data;
        console.log(`Processing crawl for: ${projectId}`);
        await this.runPupeteer(projectId);
    }

    async runPupeteer(projectId: string){
        const project = await this.projectsService.getProject(projectId);
        if (!project) throw new Error(`Project ${projectId} not found`);

        const browser = await puppeteer.launch({headless:true});
        const visited = new Set<string>();

        try{
            await this.crawlPage(browser, projectId, project.sourceUrl,null, 0, 2, visited);
            await this.projectsService.updateStatus(projectId,ProjectStatus.CRAWL_COMPLETE);
            await this.brandExtractor.extractBrandFromProject(projectId);
            console.log(`Crawl complete for : ${projectId}`);
        }
        finally{
            await browser.close();
        }
    }


    async crawlPage(
        browser: Browser,
        projectId: string, 
        url: string,
        parentUrl:string | null,
        depth: number,
        maxDepth:number, 
        visited: Set<string>,
    ) {
        if(depth > maxDepth || visited.has(url))  return;
        visited.add(url);
        
        const page = await browser.newPage();
        try{
            await page.goto(url, {waitUntil: 'networkidle2'});
            const baseHost = new URL(url).hostname;
            const html = await page.content();
            const title = await page.title();
            const path = new URL(url).pathname;
            const contentHash = createHash('md5').update(html).digest('hex');

            const savedPage = 
            await this.pagesService.createPage({
                projectId,
                url,
                path,
                parentUrl,
                title,
                rawHtml:html,
                depth,
                statusCode:200,
                contentHash,

            });

            //Parse Content into asset, content, metadata, etc
            try{
                const parsed = this.parserService.parse(html,baseHost);
                await this.prismaService.parsedContent.create({
                    data: {
                        pageId: savedPage.id,
                        ...parsed
                    }
                });
            }
            catch (err){
                console.log(`Parsed failed for ${savedPage.url}`,err);
            }

            //Add Accessibility score from axe core
            try{
                const violations = await this.accessibilityService.audit(html, url);
                await this.prismaService.auditResult.create({
                    data:{
                        pageId: savedPage.id,
                        score: violations.length === 0 ? 100: Math.max(0,100 - violations.length*5),
                        passCount: 0,
                        failCount: violations.length,
                        violations: {
                            create: violations.flatMap( v => 
                                v.nodes.map(n =>({
                                    ruleId: v.ruleId,
                                    impact: v.impact ?? 'unknown',
                                    description: v.description,
                                    helpUrl: v.helpUrl,
                                    nodes: n,
                                }))
                            )
                        }

                    }
                });
            }  catch(err){
                console.log(`Audit failed for ${url}`, err);
            }


            //Analysis sent to LLM 
            await enqueue(analysisQueue,'analyze-job', { pageId:savedPage.id });

            console.log(`[depth ${depth}] Crawled: ${title} — ${url}`);

            if(depth< maxDepth){
                const links = await page.$$eval('a[href]',
                    (anchors) => 
                        anchors.map( (a) => (a as HTMLAnchorElement).href ),
                )

                
                const sameDomainLinks = links.filter((link)=>{
                    try{
                        const parsed = new URL(link);
                        if(parsed.hostname!== baseHost) return false;
                        if(parsed.pathname === new URL(url).pathname && parsed.hash) return false;
                        return true;
                    } catch{
                        return false;
                    }
                });

                for (const link of sameDomainLinks){
                    await this.crawlPage(browser, projectId, link, url,depth+1, maxDepth,visited);
                }

            }
        }
        catch(exp){
            console.log(`Error encountered ${exp}`);
        }
        finally{
            await page.close();
        }

    }

}