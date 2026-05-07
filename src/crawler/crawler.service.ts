import { Injectable } from '@nestjs/common';
import { crawlQueue } from 'src/queue/queue.module';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class CrawlerService{
constructor(private projectsService : ProjectsService){}

    async startCrawl(projectId: string){

        await this.projectsService.updateStatus(projectId,ProjectStatus.CRAWLING);
        await crawlQueue.add('crawl-job',{projectId});
        //this.runCrawlingSimulation(projectId);
        return {'message': 'Crawl Queued', projectId};

    }

    // private async runCrawlingSimulation(projectId: string){
    //     try{
    //         await new Promise(resolve=>{
    //             setTimeout(resolve, 3000);
    //         })
    //         console.log('Crawling Complete for Project:', projectId);
    //         this.projectsService.updateStatus(projectId,ProjectStatus.CRAWL_COMPLETE);
    //     }
    //     catch(err){
    //         console.log('Crawling Failed for Project:', projectId);
    //     }
    // }

}







