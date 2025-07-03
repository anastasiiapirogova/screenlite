import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { z } from 'zod'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { addFileForceDeletedJobs } from '../utils/addFileForceDeletedJobs.ts'

const requestSchema = z.object({
    folderIds: z.array(z.string())
})

export const forceDeleteFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { folderIds } = result.data

    const filesToDelete = await prisma.file.findMany({
        where: {
            folderId: {
                in: folderIds
            },
            workspaceId: workspace.id,
            deletedAt: { not: null }
        },
        select: {
            id: true
        }
    })

    const fileIds = filesToDelete.map(file => file.id)

    await prisma.folder.deleteMany({
        where: {
            id: { in: folderIds },
            workspaceId: workspace.id,
            deletedAt: { not: null },
            parentId: null
        }
    })

    if (fileIds.length > 0) {
        addFileForceDeletedJobs(fileIds)
    }

    return ResponseHandler.ok(res, {
        forceDeletedFolderIds: folderIds,
        forceDeletedFileIds: fileIds
    })
} 