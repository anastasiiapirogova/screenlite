import { bullmqConnection } from '@/config/bullmq.js'
import { Queue } from 'bullmq'

export const deviceQueue = new Queue('deviceQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})