import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { restoreFoldersSchema } from '../schemas/folderSchemas.ts'
import { FolderRestoreService } from '../services/FolderRestoreService.ts'

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