import { Request, Response } from 'express'
import { createFolderSchema } from '../schemas/folderSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FolderRepository } from '../repositories/FolderRepository.ts'
import { MAX_FOLDER_DEPTH } from '@/config/files.ts'

export const createFolder = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await createFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, parentId } = validation.data

    const parentFolder = parentId ? await FolderRepository.findFolder(parentId, workspace.id) : null

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