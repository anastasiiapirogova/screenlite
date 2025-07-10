import { playlistQueue } from '@/bullmq/queues/playlistQueue.ts'

export class PlaylistJobProducer {
    static async queueRecalculatePlaylistSizeJob(playlistId: string): Promise<void> {
        await playlistQueue.add(
            'recalculatePlaylistSize',
            { playlistId },
            {
                deduplication: { id: `recalculatePlaylistSize-${playlistId}` },
            }
        )
    }

    static async queuePlaylistUpdatedJob(playlistId: string, context: string): Promise<void> {
        const deduplicationId = `playlistUpdated-${playlistId}`

        await playlistQueue.add(
            'playlistUpdated',
            { playlistId, context },
            {
                deduplication: { id: deduplicationId },
            }
        )
    }

    static async queuePlaylistUpdatedJobs(playlistIds: string[], context: string): Promise<void> {
        const jobs = playlistIds.map((playlistId) => 
            this.queuePlaylistUpdatedJob(playlistId, context)
        )

        await Promise.all(jobs)
    }
} 