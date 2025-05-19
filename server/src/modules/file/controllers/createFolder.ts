import { Request, Response } from 'express'
import { createFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

export const createFolder = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, name, parentId } = validation.data

    const workspace = await WorkspaceRepository.getWithFolder(workspaceId, parentId)

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canCreateFolders(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const parentFolderId = workspace.folders?.[0]?.id ?? null

    const folder = await FolderRepository.createFolder({
        name,
        workspaceId: workspace.id,
        parentId: parentFolderId,
    })

    return ResponseHandler.created(res, { folder })
}