import { prisma } from '@/config/prisma.ts'
import { PlaylistItemRepository } from '../repositories/PlaylistItemRepository.ts'

export const calculatePlaylistSize = async (playlistId: string): Promise<bigint> => {
    const playlistItems = await prisma.playlistItem.findMany({
        where: {
            playlistId,
        },
        select: {
            type: true,
            fileId: true,
            nestedPlaylistId: true,
            nestedPlaylist: {
                select: {
                    size: true
                }
            }
        },
        distinct: ['fileId', 'nestedPlaylistId'],
    })

    if (playlistItems.length === 0) {
        return BigInt(0)
    }

    let totalSize = BigInt(0)

    const fileIds = playlistItems
        .filter(item => item.type === PlaylistItemRepository.TYPE.FILE)
        .map(item => item.fileId)
        .filter((fileId): fileId is string => fileId !== null)

    if (fileIds.length > 0) {
        const fileSizes = await prisma.file.aggregate({
            _sum: {
                size: true,
            },
            where: {
                id: {
                    in: fileIds,
                },
                deletedAt: null,
            },
        })

        totalSize += fileSizes._sum.size || BigInt(0)
    }

    const nestedPlaylistSizes = playlistItems
        .filter(item => 
            item.type === PlaylistItemRepository.TYPE.NESTED_PLAYLIST && 
            item.nestedPlaylist !== null
        )
        .map(item => item.nestedPlaylist!.size)

    totalSize += nestedPlaylistSizes.reduce((sum, size) => sum + size, BigInt(0))

    return totalSize
}