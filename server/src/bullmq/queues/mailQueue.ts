import { Queue } from 'bullmq'
import { bullmqConnection } from '@/config/bullmq.ts'
import { MailJobData } from '../workers/mailWorker.ts'

export const mailQueue = new Queue<MailJobData>('mailQueue', {
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