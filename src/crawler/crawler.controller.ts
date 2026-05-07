
import {Controller, Post, Body} from '@nestjs/common';
import {CrawlerService} from './crawler.service';
import { StartCrawlDto } from './dto/start-crawl.dto';

@Controller('crawl')
export class CrawlerController{
    
    constructor(private crawlerService: CrawlerService){}

    @Post()
    startcrawl(@Body() dto: StartCrawlDto){
        return this.crawlerService.startCrawl(dto.projectId);
    } 
}