import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getWorkspaceFoldersSchema } from '../schemas/folderSchemas.ts'
import { prisma } from '@/config/prisma.ts'

export const getWorkspaceFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const parsedData = getWorkspaceFoldersSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { search, parentId } = parsedData.data

    const parentIdParsed = search ? Prisma.skip : parentId ? parentId : null

    const whereClause: Prisma.FolderWhereInput = {
        workspaceId: workspace.id,
        name: search ? {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
        } : Prisma.skip,
        deletedAt: null,
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
