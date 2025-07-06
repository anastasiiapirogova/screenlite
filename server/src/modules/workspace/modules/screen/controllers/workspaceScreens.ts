import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { workspaceScreensSchema } from '../schemas/screenSchemas.ts'
import { getDeviceStatusClause } from '../utils/getDeviceStatusClause.ts'

export const workspaceScreens = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = workspaceScreensSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, search, playlistId, status, type } = validation.data

    const typeIsSet = type ? type.length > 0 : false

    const where: Prisma.ScreenWhereInput = {
        workspaceId: workspace.id,
        name: search ? {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
        } : Prisma.skip,
        type: typeIsSet ? {
            in: type,
        } : Prisma.skip,
        ...getDeviceStatusClause(status),
    }

    const [screens, total] = await Promise.all([
        prisma.screen.findMany({
            where,
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
                        onlineAt: true
                    }
                },
                _count: {
                    select: {
                        playlists: true
                    }
                }
            },
        }),
        prisma.screen.count({ where })
    ])

    const meta = {
        page,
        limit,
        total
    }

    return ResponseHandler.paginated(res, screens, meta)
}
