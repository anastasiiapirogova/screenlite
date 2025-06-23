import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { restoreFilesSchema } from '../schemas/fileSchemas.js'
import { FileRestoreService } from '../services/FileRestoreService.js'

export const restoreFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await restoreFilesSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds } = validation.data

    const result = await FileRestoreService.restoreFiles(fileIds, workspace.id)

    return ResponseHandler.ok(res, {
        message: result.restoredFiles.length > 0 ? 'FILES_RESTORED' : 'NO_FILES_TO_RESTORE',
        ...result
    })
} 