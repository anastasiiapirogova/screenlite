import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getWorkspaceFilesSchema } from '../schemas/fileSchemas.ts'
import { prisma } from '@/config/prisma.ts'

export const getWorkspaceFiles = async (req: Request, res: Response) => {
    const reqWorkspace = req.workspace!

    const parsedData = getWorkspaceFilesSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search, deleted, folderId } = parsedData.data

    const folderIdParsed = search ? Prisma.skip : folderId ? folderId : null

    const whereClause: Prisma.FileWhereInput = {
        workspaceId: reqWorkspace.id,
        name: search ? {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
        } : Prisma.skip,
        deletedAt: deleted ? {
            not: null
        } : null,
        folderId: folderIdParsed,
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
