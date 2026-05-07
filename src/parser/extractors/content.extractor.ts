import * as cheerio from 'cheerio';

export class ContentExtractor{
    extract(html:string){
        const $ = cheerio.load(html);

        $('nav,header, footer, aside, script, style').remove();


        const mainContent = $('main').length ? $('main')
        :$('article').length ? $('article')
        :$('div#content, div.content, div#main, div.main-content').first().length ? $('div#content, div.content, div#main, div.main-content').first()
        :$('body');

        const headings = mainContent.find('h1, h2, h3, h4, h5, h6').map((_, el) => $(el).text().trim()).get().filter(text => text.length >0);
        const parags = mainContent.find('p').map((_,ele)=>$(ele).text().trim()).get().filter(text => text.length>0);

        return{
            headings: headings,
            paragraphs: parags,
            mainText: mainContent.text().trim(),
        }

    }
}