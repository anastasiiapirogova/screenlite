import { playlistQueue } from '@/bullmq/queues/playlistQueue.ts'

export const addRecalculatePlaylistSizeJob = async (playlistId: string) => {
    await playlistQueue.add(
        'recalculatePlaylistSize',
        { playlistId },
        {
            deduplication: { id: `recalculatePlaylistSize-${playlistId}` },
        },
    )
}
