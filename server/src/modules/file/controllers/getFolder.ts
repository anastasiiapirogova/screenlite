import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { getFolderSchema } from '../schemas/folderSchemas.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'

export const getFolder = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.VIEW_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const validation = await getFolderSchema.safeParseAsync(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderId } = validation.data

    const folder = await FolderRepository.findFolder(folderId, workspace.id)

    if (!folder) {
        return ResponseHandler.notFound(res)
    }

    const parentFolderTree = await FolderRepository.findFolderAncestorsById(folderId)

    return ResponseHandler.json(res, {
        folder,
        parentFolders: parentFolderTree,
    })
}
