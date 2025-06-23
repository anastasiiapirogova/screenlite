import { playlistQueue, PlaylistQueueJobData } from '@/bullmq/queues/playlistQueue.js'

export const addPlaylistUpdatedJob = async (data: PlaylistQueueJobData) => {
    const deduplicationId = `playlistUpdated-${data.playlistId}`

    await playlistQueue.add(
        'playlistUpdated',
        data,
        {
            deduplication: { id: deduplicationId },
        },
    )
}