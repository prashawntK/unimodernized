//docker run -d -p 6379:6379 redis

import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({
    host : 'localhost',
    port : 6379,
});

export const crawlQueue = new Queue('crawl', {connection});
export const analysisQueue = new Queue('analysis', {connection});
export const redesignQueue = new Queue('redesign', {connection});

@Module({
    
})
export class QueueModule{}