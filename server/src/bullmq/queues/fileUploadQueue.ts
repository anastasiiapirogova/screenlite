import { bullmqConnection } from '@config/bullmq.js'
import { Queue } from 'bullmq'

export const fileUploadQueue = new Queue('fileUploadQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})