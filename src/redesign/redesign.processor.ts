import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { RedesignService } from './redesign.service';
import { BaseProcessor } from 'src/queue/base.processor';
@Injectable()
export class RedesignProcessor extends BaseProcessor{

    constructor(
        config: ConfigService,
        private redesignService: RedesignService,
    ){
        super('redesign',config)
    }

    async process(job: Job){
        const { pageId } = job.data;
        console.log(`Redesigning page: ${pageId}`);
        await this.redesignService.redesignPage(pageId);
        console.log(`Redesigning complete for: ${pageId}`);
    }
}