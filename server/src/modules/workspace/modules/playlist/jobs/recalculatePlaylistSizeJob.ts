import { prisma } from '@/config/prisma.ts'
import { calculatePlaylistSize } from '../utils/calculatePlaylistSize.ts'

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
