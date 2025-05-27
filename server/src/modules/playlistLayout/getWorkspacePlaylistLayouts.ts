import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { Prisma } from 'generated/prisma/client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { playlistLayoutPolicy } from './policies/playlistLayoutPolicy.js'
import { getWorkspaceLayoutsSchema } from './schemas/playlistLayoutSchemas.js'

export const getWorkspacePlaylistLayouts = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const parsedData = getWorkspaceLayoutsSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search } = parsedData.data

    const layoutsWhereClause: Prisma.PlaylistLayoutFindManyArgs = {
        where: {
            name: search ? {
                contains: search,
                mode: 'insensitive',
            } : Prisma.skip
        }
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            layouts: {
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    name: 'asc',
                },
                ...layoutsWhereClause,
                include: {
                    _count: {
                        select: {
                            playlists: {
                                where: {
                                    deletedAt: null
                                }
                            }
                        },
                    },
                },
            },
            _count: {
                select: {
                    layouts: {
                        ...layoutsWhereClause
                    } 
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistLayoutPolicy.canViewPlaylistLayouts(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.layouts
    const pages = Math.ceil(total / limit)

    ResponseHandler.json(res, {
        data: workspace.layouts,
        meta: {
            page,
            limit,
            pages,
            total
        }
    })
}
