import { Request, Response } from 'express'
import { moveFilesSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { FileRepository } from '../repositories/FileRepository.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'
import { FileMoveService } from '../services/FileMoveService.js'

export const moveFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.UPDATE_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const validation = await moveFilesSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds, targetFolderId } = validation.data

    const filesToMove = await FileRepository.findActiveFilesByIds(fileIds)

    if (!filesToMove.length) {
        return ResponseHandler.json(res, { files: [] })
    }

    const moveValidation = await FileMoveService.validateMove(filesToMove, workspace.id, targetFolderId)

    if (!moveValidation.isValid) {
        return ResponseHandler.validationError(req, res, {
            [moveValidation.error!.field]: moveValidation.error!.message
        })
    }

    const updatedFiles = await FileRepository.moveFilesToFolder(fileIds, targetFolderId)

    return ResponseHandler.json(res, { files: updatedFiles })
}
