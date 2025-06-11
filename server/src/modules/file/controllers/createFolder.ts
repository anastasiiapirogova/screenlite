import { Request, Response } from 'express'
import { createFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'
import { MAX_FOLDER_DEPTH } from '@config/files.js'

export const createFolder = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.CREATE_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const validation = await createFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, parentId } = validation.data

    const parentFolder = parentId ? await FolderRepository.findFolderInWorkspace(workspace.id, parentId) : null

    const isParentFolderDeleted = parentFolder && parentFolder.deletedAt

    if (isParentFolderDeleted) {
        return ResponseHandler.validationError(req, res, {
            parentId: 'CANNOT_CREATE_IN_DELETED_FOLDER',
        })
    }

    const isParentFolderNotFound = parentId && !parentFolder

    if (isParentFolderNotFound) {
        return ResponseHandler.validationError(req, res, {
            parentId: 'FOLDER_NOT_FOUND',
        })
    }

    const folderDepth = await FolderRepository.calculateFolderDepth(workspace.id, parentId ?? null)

    if (folderDepth >= MAX_FOLDER_DEPTH) {
        return ResponseHandler.validationError(req, res, {
            parentId: 'MAX_FOLDER_DEPTH_EXCEEDED',
        })
    }

    const folder = await FolderRepository.createFolder({
        name,
        workspaceId: workspace.id,
        parentId: parentFolder?.id ?? null,
    })

    return ResponseHandler.created(res, {
        folder
    })
}