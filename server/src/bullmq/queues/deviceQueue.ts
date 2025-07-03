import { bullmqConnection } from '@/config/bullmq.ts'
import { Queue } from 'bullmq'

export type DeviceQueueJobData = {
    token: string
}

export const deviceQueue = new Queue<DeviceQueueJobData>('deviceQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})