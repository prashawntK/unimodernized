import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { RedesignService } from './redesign.service';
import { BaseProcessor } from 'src/queue/base.processor';
import { EventsGateway } from 'src/events/events.gateway';
@Injectable()
export class RedesignProcessor extends BaseProcessor{

    constructor(
        config: ConfigService,
        private redesignService: RedesignService,
        private gateway: EventsGateway
    ){
        super('redesign',config)
    }

    async process(job: Job){
        const { pageId, pageUrl, projectId } = job.data;
        console.log(`Redesigning page: ${pageId}`);
        await this.redesignService.redesignPage(pageId);
        this.gateway.emitRedesignComplete(projectId,pageUrl);
        console.log(`Redesigning complete for: ${pageId}`);
    }
}