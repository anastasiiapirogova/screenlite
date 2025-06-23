import { prisma } from '@/config/prisma.js'
import { calculatePlaylistSize } from '../utils/calculatePlaylistSize.js'

export const recalculatePlaylistSizeJob = async (playlistId: string) => {
    const newPlaylistSize = await calculatePlaylistSize(playlistId)

    await prisma.playlist.update({
        where: {
            id: playlistId
        },
        data: {
            size: newPlaylistSize
        }
    })
}
