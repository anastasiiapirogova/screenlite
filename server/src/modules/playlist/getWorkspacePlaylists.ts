import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { Prisma } from 'generated/prisma/client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { playlistPolicy } from './policies/playlistPolicy.js'
import { exclude } from '@utils/exclude.js'
import { getPlaylistStatusClause } from './utils/getPlaylistStatusClause.js'
import { getWorkspacePlaylistsSchema } from './schemas/playlistSchemas.js'

export const getWorkspacePlaylists = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

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

    const playlistWhereClause: Prisma.PlaylistFindManyArgs = {
        where: {
            name: search ? {
                contains: search,
                mode: 'insensitive',
            } : Prisma.skip,
            ...getPlaylistStatusClause(status),
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
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            playlists: {
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    updatedAt: 'desc',
                },
                ...playlistWhereClause,
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
            },
            _count: {
                select: {
                    playlists: {
                        ...playlistWhereClause
                    }
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canViewPlaylists(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.playlists
    const pages = Math.max(Math.ceil(total / limit), 1)

    const playlists = workspace.playlists.map(playlist => {
        return {
            ...(exclude(playlist, ['parentItems'])),
            _count: {
                screens: playlist._count.screens,
                items: playlist._count.items,
                parentPlaylists: playlist.type === 'nestable' ? playlist.parentItems.length : undefined,
            }
        }
    })

    ResponseHandler.json(res, {
        data: playlists,
        meta: {
            page,
            pages,
            limit,
            total
        }
    })
}
