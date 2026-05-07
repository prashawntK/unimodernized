import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Worker, Job} from 'bullmq';
import { ConfigService } from "@nestjs/config";

@Injectable()
export abstract class BaseProcessor implements OnModuleDestroy, OnModuleInit{
    private worker!: Worker;

    constructor(
        private readonly queueName: string,
        private readonly config: ConfigService,
    ){}

    abstract process(job: Job): Promise<void>;

    onModuleInit() {
        this.worker = new Worker(
            this.queueName,
            async (job) =>{
                console.log(`[${this.queueName}] Processing job ${job.id}`);
                try{
                    await this.process(job);
                    console.log(`[${this.queueName}] Job ${job.id} complete`);
                } catch (err) {
                    console.error(`[${this.queueName}] Job ${job.id} failed:`, err);
                    throw err;
                }
            },
            {
                connection:{
                    host: this.config.get('REDIS_HOST'),
                    port: this.config.get<number>('REDIS_PORT'),
                }
            }
        );

        this.worker.on('failed', (job, err) => {
            console.error(`[${this.queueName}] Job ${job?.id} attempt ${job?.attemptsMade}/${job?.opts.attempts} failed: ${err.message}`);
            if ((job?.attemptsMade ?? 0) < (job?.opts.attempts ?? 3)) {
                console.log(`[${this.queueName}] Retrying job ${job?.id}...`);
            } else {
                console.error(`[${this.queueName}] Job ${job?.id} exhausted all retries.`);
            }
        });
        
    }

    async onModuleDestroy() {
        await this.worker.close();
    }

}