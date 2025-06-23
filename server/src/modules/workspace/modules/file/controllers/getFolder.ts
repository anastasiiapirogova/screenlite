import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { getFolderSchema } from '../schemas/folderSchemas.js'

export const getFolder = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await getFolderSchema.safeParseAsync(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderId } = validation.data

    const folder = await FolderRepository.findFolder(folderId, workspace.id)

    if (!folder) {
        return ResponseHandler.notFound(req, res)
    }

    const parentFolderTree = await FolderRepository.findFolderAncestorsById(folderId)

    return ResponseHandler.json(res, {
        folder,
        parentFolders: parentFolderTree,
    })
}
