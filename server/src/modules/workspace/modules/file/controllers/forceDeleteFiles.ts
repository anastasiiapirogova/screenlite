import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { z } from 'zod'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { addFileForceDeletedJobs } from '../utils/addFileForceDeletedJobs.ts'

const requestSchema = z.object({
    fileIds: z.array(z.string())
})

export const forceDeleteFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    
    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { fileIds } = result.data

    await prisma.file.updateMany({
        where: {
            id: { in: fileIds },
            workspaceId: workspace.id,
            deletedAt: { not: null }
        },
        data: {
            forceDeleteRequestedAt: new Date(),
            folderId: null,
            folderIdBeforeDeletion: null,
        }
    })

    addFileForceDeletedJobs(fileIds)

    return ResponseHandler.ok(res, {
        forceDeletedFileIds: fileIds
    })
} 