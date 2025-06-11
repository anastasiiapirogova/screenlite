import { Request, Response } from 'express'
import { deleteFilesSchema } from '../schemas/fileSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { prisma } from '@config/prisma.js'
import { Prisma } from 'generated/prisma/client.js'
import { FileRepository } from '../repositories/FileRepository.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'

export const softDeleteFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.DELETE_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

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
        return ResponseHandler.serverError(res)
    }
} 