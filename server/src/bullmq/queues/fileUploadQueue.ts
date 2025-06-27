import { bullmqConnection } from '@/config/bullmq.ts'
import { Queue } from 'bullmq'

export const fileUploadQueue = new Queue('fileUploadQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})