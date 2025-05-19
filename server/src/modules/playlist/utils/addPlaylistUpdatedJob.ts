import { playlistQueue } from 'bullmq/queues/playlistQueue.js'

export const addPlaylistUpdatedJob = async (playlistId: string) => {
    await playlistQueue.add(
        'playlistUpdated',
        { playlistId },
        {
            deduplication: { id: `playlistUpdated-${playlistId}` },
        },
    )
}