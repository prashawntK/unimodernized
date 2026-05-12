import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { BaseProcessor } from 'src/queue/base.processor';
import { AnalysisService } from './analysis.service';
import { enqueue } from 'src/queue/queue.helper';
import { redesignQueue } from 'src/queue/queue.module';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class AnalysisProcessor extends BaseProcessor{
    constructor(
        config: ConfigService,
        private analysisService: AnalysisService,
        private gateway: EventsGateway
    ){
        super('analysis',config);
    }

    async process(job: Job): Promise<void> {
        const { pageId, pageUrl, projectId } = job.data;
        await this.analysisService.analyzePage(pageId);
        this.gateway.emitAnalysisComplete(projectId, pageUrl);
        await enqueue(redesignQueue, 'redesign-job', { pageId, pageUrl, projectId });
    }


}