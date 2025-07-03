import { bullmqConnection } from '@/config/bullmq.ts'
import { handlePlaylistUpdatedJob } from '@/modules/workspace/modules/playlist/jobs/handlePlaylistUpdatedJob.ts'
import { recalculatePlaylistSizeJob } from '@/modules/workspace/modules/playlist/jobs/recalculatePlaylistSizeJob.ts'
import { Job, Worker } from 'bullmq'
import { playlistQueue, PlaylistQueueJobData } from '@/bullmq/queues/playlistQueue.ts'
import { info, error } from '@/utils/logger.ts'

const processor = async (job: Job<PlaylistQueueJobData>) => {
    const { playlistId } = job.data

    info(`Started job: ${job.name}, playlistId: ${playlistId}`, { category: 'playlistQueueWorker' })
    try {
        if (job.name === 'recalculatePlaylistSize') {
            if (playlistId) {
                await recalculatePlaylistSizeJob(playlistId)
            }
        }

        if (job.name === 'playlistUpdated') {
            if (playlistId) {
                await handlePlaylistUpdatedJob(playlistId)
            }
        }
        info(`Completed job: ${job.name}, playlistId: ${playlistId}`, { category: 'playlistQueueWorker' })
    } catch (err) {
        error(`Error processing job: ${job.name}, playlistId: ${playlistId}`, err, { category: 'playlistQueueWorker' })
        throw error
    }
}

export const playlistQueueWorker = new Worker(
    playlistQueue.name,
    processor,
    {
        connection: bullmqConnection,
    }
)