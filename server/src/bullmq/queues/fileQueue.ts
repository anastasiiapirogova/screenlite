import { bullmqConnection } from '@/config/bullmq.ts'
import { Queue } from 'bullmq'

export type FileQueueJobData = {
    fileId: string
}

export const fileQueue = new Queue<FileQueueJobData>('fileQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
})