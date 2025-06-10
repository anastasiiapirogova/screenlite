import { Request, Response } from 'express'
import { Prisma } from 'generated/prisma/client.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { getWorkspaceFilesSchema } from '../schemas/fileSchemas.js'
import { prisma } from '@config/prisma.js'

export const getWorkspaceFiles = async (req: Request, res: Response) => {
    const reqWorkspace = req.workspace!

    const allowed = WorkspacePermissionService.can(reqWorkspace.permissions, WORKSPACE_PERMISSIONS.VIEW_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }
    
    const parsedData = getWorkspaceFilesSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search, deleted, folderId } = parsedData.data

    const whereClause: Prisma.FileWhereInput = {
        workspaceId: reqWorkspace.id,
        name: search ? {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
        } : Prisma.skip,
        deletedAt: deleted ? {
            not: null
        } : null,
        folderId: folderId !== undefined ? folderId : Prisma.skip,
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

    const pages = Math.ceil(total / limit)

    return ResponseHandler.json(res, {
        data: files,
        meta: {
            page,
            limit,
            pages,
            total,
        }
    })
}
