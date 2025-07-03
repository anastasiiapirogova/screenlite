import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { exclude } from '@/utils/exclude.ts'
import { getWorkspacePlaylistsSchema } from '../schemas/playlistSchemas.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'

export const workspacePlaylists = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = getWorkspacePlaylistsSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, search, status, type, has_screens, has_content } = validation.data

    const hasScreens = has_screens?.includes('true')
    const hasNoScreens = has_screens?.includes('false')
    const hasContent = has_content?.includes('true')
    const hasNoContent = has_content?.includes('false')
    const typeIsSet = type ? type.length > 0 : false

    const where: Prisma.PlaylistWhereInput = {
        workspaceId: workspace.id,
        name: search ? {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
        } : Prisma.skip,
        ...PlaylistRepository.getPlaylistStatusClause(status),
        type: typeIsSet ? {
            in: type,
        } : Prisma.skip,
        screens: hasScreens && !hasNoScreens ? {
            some: {},
        } : hasNoScreens && !hasScreens ? {
            none: {},
        } : Prisma.skip,
        items: hasContent && !hasNoContent ? {
            some: {},
        } : hasNoContent && !hasContent ? {
            none: {},
        } : Prisma.skip,
    }

    const [playlists, total] = await Promise.all([
        prisma.playlist.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                _count: {
                    select: {
                        screens: true,
                        items: true,
                    },
                },
                parentItems: {
                    distinct: ['playlistId'],
                    select: {
                        playlistId: true
                    }
                }
            },
        }),
        prisma.playlist.count({ where })
    ])

    const formattedPlaylists = playlists.map(playlist => ({
        ...exclude(playlist, ['parentItems']),
        _count: {
            screens: playlist._count.screens,
            items: playlist._count.items,
            parentPlaylists: playlist.type === PlaylistRepository.TYPE.NESTABLE ? playlist.parentItems.length : undefined,
        }
    }))

    const meta = {
        page,
        limit,
        total
    }

    ResponseHandler.paginated(res, formattedPlaylists, meta)
}
