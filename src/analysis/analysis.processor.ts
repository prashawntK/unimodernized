import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { BaseProcessor } from 'src/queue/base.processor';
import { AnalysisService } from './analysis.service';
import { enqueue } from 'src/queue/queue.helper';
import { redesignQueue } from 'src/queue/queue.module';

@Injectable()
export class AnalysisProcessor extends BaseProcessor{
    constructor(
        config: ConfigService,
        private analysisService: AnalysisService,
    ){
        super('analysis',config);
    }

    async process(job: Job): Promise<void> {
        const { pageId } = job.data;
        await this.analysisService.analyzePage(pageId);
        await enqueue(redesignQueue, 'redesign-job', { pageId });
    }


}