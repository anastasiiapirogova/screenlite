import { Request, Response } from 'express'
import { deleteFilesSchema } from '../schemas/fileSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { prisma } from '@/config/prisma.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { FileRepository } from '../repositories/FileRepository.ts'

export const softDeleteFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await deleteFilesSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds } = validation.data

    const filesToDelete = await FileRepository.findActiveFilesByIds(fileIds, workspace.id)
       
    if (!filesToDelete.length) {
        return ResponseHandler.ok(res)
    }

    const workspaceIds = new Set(filesToDelete.map(file => file.workspaceId))

    if (workspaceIds.size !== 1) {
        return ResponseHandler.validationError(req, res, {
            fileIds: 'FILES_MUST_BELONG_TO_SAME_WORKSPACE'
        })
    }

    try {
        await prisma.$transaction(async (tx) => {
            const now = new Date()

            await tx.$executeRaw`
                UPDATE "File"
                SET "folderIdBeforeDeletion" = "folderId",
                    "folderId" = NULL,
                    "deletedAt" = ${now}
                WHERE "id" IN (${Prisma.join(fileIds)})
            `
        })

        return ResponseHandler.ok(res)
    } catch (error) {
        console.error('Error during files deletion:', error)
        return ResponseHandler.serverError(req, res)
    }
} 