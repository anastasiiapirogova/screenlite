import { playlistQueue } from '@/bullmq/queues/playlistQueue.ts'
import { addPlaylistUpdatedJob } from './addPlaylistUpdatedJob.ts'

export const addPlaylistItemsUpdatedJob = async (playlistId: string) => {
    addPlaylistUpdatedJob({ playlistId })

    await playlistQueue.add(
        'playlistItemsUpdated',
        { playlistId },
        {
            deduplication: { id: `playlistItemsUpdated-${playlistId}` },
        },
    )
}
