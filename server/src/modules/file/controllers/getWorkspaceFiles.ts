import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { z } from 'zod'
import { Prisma } from 'generated/prisma/client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { paginationSchema } from 'schemas/paginationSchema.js'

const schema = paginationSchema.extend({
    search: z.string().optional(),
    folderId: z.string().nullable().optional(),
    deleted: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
})

export const getWorkspaceFiles = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const parsedData = schema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search, deleted, folderId } = parsedData.data

    const whereClause: Prisma.FileFindManyArgs = {
        where: {
            name: search ? {
                contains: search,
                mode: 'insensitive',
            } : Prisma.skip,
            deletedAt: deleted ? {
                not: null
            } : null,
            folderId: folderId !== undefined ? folderId : Prisma.skip,
        },
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            files: {
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                ...whereClause,
                include: {
                    _count: {
                        select: {
                            playlistItems: true,
                        }
                    }
                }
            },
            _count: {
                select: {
                    files: {
                        ...whereClause
                    }
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canViewFiles(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.files
    const pages = Math.ceil(total / limit)

    return ResponseHandler.json(res, {
        data: workspace.files,
        meta: {
            page,
            limit,
            pages,
            total,
        }
    })
}
