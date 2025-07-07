import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getWorkspaceSoftDeletedFilesSchema } from '../schemas/fileSchemas.ts'
import { prisma } from '@/config/prisma.ts'

export const getWorkspaceSoftDeletedFiles = async (req: Request, res: Response) => {
    const reqWorkspace = req.workspace!

    const parsedData = getWorkspaceSoftDeletedFilesSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit } = parsedData.data

    const whereClause: Prisma.FileWhereInput = {
        workspaceId: reqWorkspace.id,
        deletedAt: {
            not: null,
        },
        folderId: null,
        forceDeleteRequestedAt: null
    }

    const [files, total] = await Promise.all([
        prisma.file.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: {
                        playlistItems: true,
                    }
                }
            }
        }),
        prisma.file.count({
            where: whereClause
        })
    ])

    const meta = {
        page,
        limit,
        total
    }

    return ResponseHandler.paginated(res, files, meta)
}
