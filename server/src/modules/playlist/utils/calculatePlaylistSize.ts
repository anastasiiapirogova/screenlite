import { prisma } from '@config/prisma.js'

export const calculatePlaylistSize = async (playlistId: string) => {
    const uniqueFileIds = await prisma.playlistItem.findMany({
        where: {
            playlistId,
        },
        select: {
            fileId: true,
        },
        distinct: ['fileId'],
    })

    const fileIds = uniqueFileIds
        .map(item => item.fileId)
        .filter((fileId): fileId is string => fileId !== null)

    if (fileIds.length === 0) {
        return 0
    }

    const totalSize = await prisma.file.aggregate({
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

    return totalSize._sum.size || 0
}