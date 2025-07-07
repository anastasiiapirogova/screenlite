import { playlistQueue } from '@/bullmq/queues/playlistQueue.ts'

export const addPlaylistUpdatedJob = async (data: { playlistId: string, context: string }) => {
    const deduplicationId = `playlistUpdated-${data.playlistId}`

    await playlistQueue.add(
        'playlistUpdated',
        { playlistId: data.playlistId, context: data.context },
        {
            deduplication: { id: deduplicationId },
        },
    )
}