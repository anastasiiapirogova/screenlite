import { playlistQueue } from 'bullmq/queues/playlistQueue.js'
import { addPlaylistUpdatedJob } from './addPlaylistUpdatedJob.js'

export const addPlaylistItemsUpdatedJob = async (playlistId: string) => {
    addPlaylistUpdatedJob(playlistId)

    await playlistQueue.add(
        'playlistItemsUpdated',
        { playlistId },
        {
            deduplication: { id: `playlistItemsUpdated-${playlistId}` },
        },
    )
}
