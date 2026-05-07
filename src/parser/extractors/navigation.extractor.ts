import * as cheerio from 'cheerio';

export class NavigationExtractor{

    extract(html:string, baseUrl: string){

        const $  = cheerio.load(html);

        const primaryNav = $('nav a, .navbar a, #main-nav a').map((_,el) =>({
            href:$(el).attr('href'),
            text:$(el).text().trim(),
        }))
        .get();

        const breadcrumbs = $('.breadcrumb a, [aria-label="breadcrumb"] a, nav.breadcrumbs a').map((_,el)=>({
            href: $(el).attr('href'),
            text: $(el).text().trim(),
        }))
        .get();

        const allLinks = $('a[href]').map((_,el)=>{
            const href = $(el).attr('href') || '';
            return {
                href,
                text: $(el).text().trim(),
                internal: !href.startsWith('http') || href.includes(baseUrl),
            }
        })
        .get();

        return {
            primaryNav,
            breadcrumbs,
            allLinks
        };

    }   
}