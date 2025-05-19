import { bullmqConnection } from '@config/bullmq.js'
import { handlePlaylistUpdatedJob } from '@modules/playlist/jobs/handlePlaylistUpdatedJob.js'
import { recalculatePlaylistSizeJob } from '@modules/playlist/jobs/recalculatePlaylistSizeJob.js'
import { Job, Worker } from 'bullmq'
import { playlistQueue, PlaylistQueueJobData } from 'bullmq/queues/playlistQueue.js'

const processor = async (job: Job<PlaylistQueueJobData>) => {
    const { playlistId } = job.data

    try {
        if (job.name === 'playlistItemsUpdated') {
            if (playlistId) {
                await recalculatePlaylistSizeJob(playlistId)
            }
        }

        if (job.name === 'playlistUpdated') {
            if (playlistId) {
                await handlePlaylistUpdatedJob(playlistId)
            }
        }
    } catch (error) {
        console.error(`Error processing job ${job.name} for playlist ${playlistId}:`, error)
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