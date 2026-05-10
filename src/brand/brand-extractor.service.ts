import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class BrandExtractorService {
    constructor(
        private prisma: PrismaService,
    ){};

    async extractBrandFromProject(projectId: string){
        const pages = await this.prisma.page.findMany({
            where: { projectId }
        });

        const allColors:string[] = [];
        const allFonts:string[] = [];
        let logoUrl:string | null = null;
        let faviconUrl:string | null = null;


        for (const eachPages of pages){

            const result = this.extractFromHtml(eachPages.rawHtml, new URL(eachPages.url).hostname );
            allColors.push(...result.colors);
            allFonts.push(...result.fonts);
            if(!logoUrl && result.logoUrl) logoUrl = result.logoUrl;
            if(!faviconUrl && result.faviconUrl) faviconUrl = result.faviconUrl;
        }

        const colorFreq :Record<string,number> = {};
        for (const f of allColors) colorFreq[f] = (colorFreq [f] || 0) + 1;
        const topColors = Object.entries(colorFreq).sort((a,b)=> b[1] - a[1]).map(([f])=> f);
    
        const fontFreq: Record<string, number> = {};
        for (const f of allFonts) fontFreq[f] =  (fontFreq [f] || 0) + 1;
        const topFonts = Object.entries(fontFreq).sort( (a,b) => b[1] - a[1] ).map(([f]) => f);

        await this.prisma.brandProfile.create({
            data:{
                projectId,
                primaryColor:topColors[0] ?? null,
                secondaryColor:topColors[1] ?? null,
                backgroundColor:topColors[2] ?? null,
                fontHeading:topFonts[0] ?? null,
                fontBody:topFonts[1] ?? null,
                logoUrl,
                faviconUrl,
            }
        });   
    }


    extractFromHtml(html: string, baseUrl: string) {
        const $ = cheerio.load(html);

        const colors = this.extractColors($);
        const fonts = this.extractFonts($);
        const logoUrl = this.extractLogo($, baseUrl);
        const faviconUrl = this.extractFavicon($, baseUrl);

        return { colors, fonts, logoUrl, faviconUrl };
    }

    private extractColors($: cheerio.CheerioAPI) {
        const cssText = $('style').map((_,el)=> $(el).text()).get().join(' ');
        const inlineStyles = $('[style]').map((_,el)=> $(el).attr('style') || '' ).get().join(' ');
        const allCss = cssText + ' ' + inlineStyles;

        const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g;
        const matches = allCss.match(colorRegex) || [];

        const frequency: Record<string,number> = {};
        for (const color of matches){
            const normalized = color.toLowerCase().trim();
            frequency[normalized] = (frequency[normalized] || 0) + 1;
        }

        return Object.entries(frequency)
            .sort((a,b)=> b[1]-a[1])
            .slice(0,4)
            .map(([color]) => color);
        }

    private extractFonts($: cheerio.CheerioAPI) {
        const cssText = $('style').map((_,el)=> $(el).text()).get().join(' ');

        const fontRegex = /font-family\s*:\s*([^;}]+)/g;

        let result;
        const frequency: Record<string,number> = {};
        while ((result = fontRegex.exec(cssText))!==null){
            const font = result[1].trim();
            frequency[font] = (frequency[font] || 0 ) + 1 
        }

        return Object.entries(frequency)
        .sort((a,b)=> b[1]-a[1])
        .slice(0,2)
        .map(([font])=> font)

    }


    private extractLogo($: cheerio.CheerioAPI, baseUrl: string) {

        const logoSelectors = [
            'header img.logo',
            'header .logo img',
            'a.logo img',
            '#logo img',
            'img[alt*="logo" i]',
        ];

        for(const selector of logoSelectors){
            const src = $(selector).first().attr('src');
            if(src){
                return src.startsWith('http') ? src: `${baseUrl}${src}`;
            }
        }
        return null;

    }


    private extractFavicon($: cheerio.CheerioAPI, baseUrl: string) {
        const href  = $('link[rel="icon"], link[rel="shortcut icon"]').first().attr('href');
        if (!href) return null;
        return href.startsWith('http') ? href : `${baseUrl}${href}`;

    }
    }
