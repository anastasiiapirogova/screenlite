import { Request, Response } from 'express'
import { updateFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

export const updateFolder = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await updateFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, folderId } = validation.data

    const folder = await FolderRepository.getFolderById(folderId)

    if (!folder) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canUpdateFolders(user, folder.workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    if(folder.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_IS_DELETED'
        })
    }

    const updatedFolder = await FolderRepository.updateFolder(folderId, {
        name,
    })

    return ResponseHandler.created(res, {
        folder: updatedFolder
    })
}