
import {Controller, Post, Body, Req} from '@nestjs/common';
import {CrawlerService} from './crawler.service';
import { StartCrawlDto } from './dto/start-crawl.dto';
import { ProjectsService } from 'src/projects/projects.service';

@Controller('crawl')
export class CrawlerController{
    
    constructor(
        private crawlerService: CrawlerService,
        private projectService: ProjectsService
    ){}

    @Post()
    async startcrawl(@Body() dto: StartCrawlDto, @Req() req){
        await this.projectService.getProject(dto.projectId, req.user.sub);
        return this.crawlerService.startCrawl(dto.projectId);
    } 
}