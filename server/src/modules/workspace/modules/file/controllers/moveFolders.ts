import { Request, Response } from 'express'
import { moveFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { FolderMoveService } from '../services/FolderMoveService.js'

export const moveFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await moveFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds, targetFolderId } = validation.data

    const foldersToMove = await FolderRepository.findActiveFoldersByIds(folderIds, workspace.id)

    if (!foldersToMove.length) {
        return ResponseHandler.json(res, { folders: [] })
    }

    const moveValidation = await FolderMoveService.validateMove(foldersToMove, workspace.id, targetFolderId)

    if (!moveValidation.isValid) {
        return ResponseHandler.validationError(req, res, {
            [moveValidation.error!.field]: moveValidation.error!.message
        })
    }

    const updatedFolders = await FolderRepository.updateFoldersParent(folderIds, targetFolderId)

    return ResponseHandler.json(res, { folders: updatedFolders })
}