import { prisma } from '@config/prisma.js'
import { addPlaylistUpdatedJobs } from '@modules/playlist/utils/addPlaylistUpdatedJobs.js'

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

    addPlaylistUpdatedJobs(playlistIds)
}