import { prisma } from '@/config/prisma.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const recalculatePlaylistSizeJob = async (playlistId: string) => {
    const newPlaylistSize = await PlaylistRepository.calculatePlaylistSize(playlistId)

    await prisma.playlist.update({
        where: {
            id: playlistId
        },
        data: {
            size: newPlaylistSize
        }
    })
}
