import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { restoreFoldersSchema } from '../schemas/folderSchemas.js'
import { FolderRestoreService } from '../services/FolderRestoreService.js'

export const restoreFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await restoreFoldersSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds } = validation.data

    const result = await FolderRestoreService.restoreFolders(folderIds, workspace.id)

    return ResponseHandler.ok(res, {
        message: result.restoredFolders.length > 0 ? 'FOLDERS_RESTORED' : 'NO_FOLDERS_TO_RESTORE',
        ...result
    })
} 