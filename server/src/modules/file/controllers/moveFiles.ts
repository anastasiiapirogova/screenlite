import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FileRepository } from '../repositories/FileRepository.ts'
import { FileMoveService } from '../services/FileMoveService.ts'
import { moveFilesSchema } from '../schemas/fileSchemas.ts'

export const moveFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await moveFilesSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds, targetFolderId } = validation.data

    const filesToMove = await FileRepository.findActiveFilesByIds(fileIds, workspace.id)

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

    return ResponseHandler.json(res, {
        files: updatedFiles
    })
}
