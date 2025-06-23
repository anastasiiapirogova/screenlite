import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { getWorkspaceFoldersSchema } from '../schemas/folderSchemas.js'
import { prisma } from '@/config/prisma.js'

export const getWorkspaceFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const parsedData = getWorkspaceFoldersSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { search, deleted, parentId } = parsedData.data

    const parentIdParsed = search ? Prisma.skip : parentId ? parentId : null

    const whereClause: Prisma.FolderWhereInput = {
        workspaceId: workspace.id,
        name: search ? {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
        } : Prisma.skip,
        deletedAt: deleted ? {
            not: null
        } : null,
        parentId: parentIdParsed,
    }

    const folders = await prisma.folder.findMany({
        where: whereClause,
        orderBy: {
            name: 'desc',
        },
        include: {
            _count: {
                select: {
                    files: true,
                    subfolders: true,
                }
            }
        }
    })

    return ResponseHandler.json(res, {
        folders,
    })
}
