import { bullmqConnection } from '@/config/bullmq.ts'
import { Queue } from 'bullmq'

export type PlaylistQueueJobData = {
    playlistId?: string
}

export const playlistQueue = new Queue<PlaylistQueueJobData>('playlistQueue', {
    connection: bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000
    }
})