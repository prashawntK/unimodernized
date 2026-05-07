import * as cheerio from 'cheerio';

export class AssetExtractor{
    extract(html:string){
        const $ = cheerio.load(html);


        return {
            images: $('img').map((_,el)=>({
                src: $(el).attr('src'),
                alt: $(el).attr('alt'),
                width: $(el).attr('width'),
                height: $(el).attr('height'),
            })).get(),
            stylesheet: $('link[rel="stylesheet"]').map((_,el)=> $(el).attr('href')).get(),
            scripts: $('script[src]').map((_,el)=> $(el).attr('src')).get(),
            fonts: $('link[rel="preload"][as="font"]').map((_,el)=> $(el).attr('href')).get(),
        }
        



        
    }

    
}