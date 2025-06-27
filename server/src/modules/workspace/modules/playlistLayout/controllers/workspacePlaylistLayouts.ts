import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getWorkspaceLayoutsSchema } from '../schemas/playlistLayoutSchemas.ts'

export const workspacePlaylistLayouts = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const parsedData = getWorkspaceLayoutsSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search } = parsedData.data

    const where: Prisma.PlaylistLayoutWhereInput = {
        workspaceId: workspace.id,
        name: search ? {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
        } : Prisma.skip
    }

    const [layouts, total] = await Promise.all([
        prisma.playlistLayout.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                name: 'asc',
            },
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
        }),
        prisma.playlistLayout.count({ where })
    ])

    const meta = {
        page,
        limit,
        total
    }

    return ResponseHandler.paginated(res, layouts, meta)
}
