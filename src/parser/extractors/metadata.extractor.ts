import * as cheerio from 'cheerio';

export class MetadataExtractor {
    extract(html:string){
        const $ = cheerio.load(html);

        return {
            title: $('title').text(),
            metaDescriptions: $('meta[name = "description"]').attr('content'),
            metaKeywords: $('meta[name = "keywords"]').attr('content'),
            ogTitle: $('meta[property = "og:title"]').attr('content'),
            ogDescription: $('meta[property = "og:description"]').attr('content'),
            ogImage: $('meta[property = "og:image"]').attr('content'),
        }
    }
}