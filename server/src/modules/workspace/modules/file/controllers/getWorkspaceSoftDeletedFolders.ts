import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getWorkspaceSoftDeletedFoldersSchema } from '../schemas/folderSchemas.ts'
import { prisma } from '@/config/prisma.ts'

export const getWorkspaceSoftDeletedFolders = async (req: Request, res: Response) => {
    const reqWorkspace = req.workspace!

    const parsedData = getWorkspaceSoftDeletedFoldersSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit } = parsedData.data

    const whereClause: Prisma.FolderWhereInput = {
        workspaceId: reqWorkspace.id,
        deletedAt: {
            not: null,
        },
        parentId: null
    }

    const [folders, total] = await Promise.all([
        prisma.folder.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: {
                        files: true,
                        subfolders: true,
                    }
                }
            }
        }),
        prisma.folder.count({
            where: whereClause
        })
    ])

    const meta = {
        page,
        limit,
        total
    }

    return ResponseHandler.paginated(res, folders, meta)
}
