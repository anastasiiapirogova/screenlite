import { Prisma } from '@generated/prisma/client.js'
import { PlaylistStatus } from '../types.js'

export const getPlaylistStatusClause = (
    status?: PlaylistStatus[]
) => {
    if (!status || status.length === 0) {
        return { deletedAt: null }
    }

    const isPublished = status.includes(PlaylistStatus.published)
    const isDraft = status.includes(PlaylistStatus.draft)
    const isDeleted = status.includes(PlaylistStatus.deleted)

    if (isPublished && isDraft && isDeleted) return {}

    if (isDeleted && (isPublished || isDraft)) {
        return {
            OR: [
                { isPublished: isPublished ? true : isDraft ? false : Prisma.skip },
                { deletedAt: { not: null } },
            ],
        }
    }

    if (isDeleted) {
        return { deletedAt: { not: null } }
    }

    return {
        isPublished: isPublished && !isDraft ? true : isDraft && !isPublished ? false : Prisma.skip,
        deletedAt: null,
    }
}