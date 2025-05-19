import { Request, Response } from 'express'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

const schema = z.object({
    id: z.string(),
})

export const getFolder = async (req: Request, res: Response) => {
    const user = req.user!

    const parsedData = schema.safeParse(req.params)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { id } = parsedData.data

    const folder = await FolderRepository.getFolderById(id)

    if (!folder) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canViewFolders(user, folder.workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const parentFolderTree = await FolderRepository.getAllParentFolders(id)

    return ResponseHandler.json(res, {
        folder,
        parentFolders: parentFolderTree,
    })
}
