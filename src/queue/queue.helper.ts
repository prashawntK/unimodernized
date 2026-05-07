import { Backoffs, Queue } from "bullmq";

const JOB_OPTIONS = {
    attempts: 3,
    backoff: {type: 'exponential', delay:2000},
}

export async function enqueue(queue: Queue,jobName:string, data:object): Promise<void> {
    await queue.add(jobName, data, JOB_OPTIONS);
}