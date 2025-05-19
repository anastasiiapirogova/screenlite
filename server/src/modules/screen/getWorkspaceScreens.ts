import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { Prisma } from '@prisma/client'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from './policies/screenPolicy.js'
import { workspaceScreensSchema } from './schemas/screenSchemas.js'
import { getDeviceStatusClause } from './utils/getDeviceStatusClause.js'

export const getWorkspaceScreens = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const validation = workspaceScreensSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, search, playlistId, status, type } = validation.data

    const typeIsSet = type ? type.length > 0 : false

    const screenWhereClause: Prisma.ScreenFindManyArgs = {
        where: {
            name: search ? {
                contains: search,
                mode: 'insensitive',
            } : Prisma.skip,
            type: typeIsSet ? {
                in: type,
            } : Prisma.skip,
            ...getDeviceStatusClause(status),
        },
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            screens: {
                ...screenWhereClause,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    name: 'asc',
                },
                include: {
                    playlists: playlistId ? {
                        where: {
                            playlistId: playlistId,
                        },
                    } : Prisma.skip,
                    device: {
                        select: {
                            id: true,
                            isOnline: true,
                        }
                    },
                    _count: {
                        select: {
                            playlists: true
                        }
                    }
                },
            },
            _count: {
                select: {
                    screens: {
                        ...screenWhereClause,
                    }
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await screenPolicy.canViewScreens(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.screens
    const pages = Math.ceil(total / limit)

    ResponseHandler.json(res, {
        data: workspace.screens,
        meta: {
            page,
            limit,
            pages,
            total,
        },
    })
}
