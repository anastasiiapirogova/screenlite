import { Request, Response } from 'express'
import { deleteFoldersSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

// TODO: Not complete yet
export const softDeleteFolders = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await deleteFoldersSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds } = validation.data

    const folder = await FolderRepository.getFolderById(folderIds[0])

    if(!folder) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_NOT_FOUND',
        })
    }

    if(folder.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_ALREADY_DELETED',
        })
    }

    const allowed = await filePolicy.canDeleteFiles(user, folder.workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const subfolders = await FolderRepository.getAllSubFolders(folderIds[0])

    return ResponseHandler.json(res, {
        subfolders
    })
    
    // return ResponseHandler.ok(res)
}