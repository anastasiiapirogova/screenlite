import { bullmqConnection } from '@/config/bullmq.ts'
import { handlePlaylistUpdatedJob } from '@/modules/workspace/modules/playlist/jobs/handlePlaylistUpdatedJob.ts'
import { recalculatePlaylistSizeJob } from '@/modules/workspace/modules/playlist/jobs/recalculatePlaylistSizeJob.ts'
import { Job, Worker } from 'bullmq'
import { playlistQueue, PlaylistQueueJobData } from '@/bullmq/queues/playlistQueue.ts'
import { createWorkerProcessor } from './workerFactory.ts'

const handlers: Record<string, (job: Job<PlaylistQueueJobData>) => Promise<void>> = {
    recalculatePlaylistSize: async (job) => {
        if (job.data.playlistId) {
            await recalculatePlaylistSizeJob(job.data.playlistId)
        }
    },
    playlistUpdated: async (job) => {
        if (job.data.playlistId) {
            await handlePlaylistUpdatedJob(job.data.playlistId)
        }
    }
}

const processor = createWorkerProcessor<PlaylistQueueJobData>({
    handlers,
    category: 'playlistQueueWorker',
    getLogContext: (job) => `playlistId: ${job.data.playlistId}${job.data.context ? ', context: ' + job.data.context : ''}`
})

export const playlistQueueWorker = new Worker(
    playlistQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)