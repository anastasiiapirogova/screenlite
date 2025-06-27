import { playlistQueue, PlaylistQueueJobData } from '@/bullmq/queues/playlistQueue.ts'

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