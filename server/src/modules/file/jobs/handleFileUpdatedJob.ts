import { prisma } from '@/config/prisma.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'

export const handleFileUpdatedJob = async (fileId: string) => {
    const playlistItems = await prisma.playlistItem.findMany({
        where: {
            fileId,
            playlist: {
                deletedAt: null,
                isPublished: true,
            }
        },
        select: {
            playlist: {
                select: {
                    id: true
                }
            }
        }
    })

    const playlistIds = [...new Set(playlistItems.map(item => item.playlist.id))]

    await PlaylistJobProducer.queuePlaylistUpdatedJobs(playlistIds, 'file updated')
}