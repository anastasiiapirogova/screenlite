import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { z } from 'zod'
import { Prisma } from 'generated/prisma/client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'

const schema = z.object({
    search: z.string().optional(),
    deleted: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
    parentId: z.string().nullable().optional(),
})

export const getWorkspaceFolders = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const parsedData = schema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { search, deleted, parentId } = parsedData.data

    const parentIdParsed = search ? Prisma.skip : parentId ? parentId : null

    const whereClause: Prisma.FolderFindManyArgs = {
        where: {
            name: search ? {
                contains: search,
                mode: 'insensitive',
            } : Prisma.skip,
            deletedAt: deleted ? {
                not: null
            } : null,
            parentId: parentIdParsed,
        },
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            folders: {
                orderBy: {
                    name: 'desc',
                },
                ...whereClause,
                include: {
                    _count: {
                        select: {
                            files: true,
                            subfolders: true,
                        }
                    }
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canViewFolders(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    return ResponseHandler.json(res, {
        folders: workspace.folders,
    })
}
