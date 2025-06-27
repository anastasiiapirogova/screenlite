import { Request, Response } from 'express'
import { updateFolderSchema } from '../schemas/folderSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FolderRepository } from '../repositories/FolderRepository.ts'

export const updateFolder = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { folderId } = req.params

    const validation = await updateFolderSchema.safeParseAsync({
        ...req.body,
        folderId
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name } = validation.data

    const folder = await FolderRepository.findFolder(folderId, workspace.id)

    if (!folder) {
        return ResponseHandler.notFound(req, res)
    }

    if (folder.deletedAt) {
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