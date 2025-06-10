import { Request, Response } from 'express'
import { moveFolderSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { Folder } from 'generated/prisma/client.js'

type MovableFolder = {
	id: string
	workspaceId: string
	deletedAt: Date | null
}

type MoveValidationResult = {
	isValid: boolean
	error?: {
		field: string
		message: string
	}
}

const validateWorkspaceAccess = async (folders: MovableFolder[], targetWorkspaceId?: string): Promise<MoveValidationResult> => {
    const folderWorkspaceIds = new Set(folders.map(folder => folder.workspaceId))
	
    if (folderWorkspaceIds.size !== 1 || !targetWorkspaceId || !folderWorkspaceIds.has(targetWorkspaceId)) {
        return {
            isValid: false,
            error: {
                field: 'workspaceId',
                message: 'ENTITIES_BELONG_TO_DIFFERENT_WORKSPACE'
            }
        }
    }

    return { isValid: true }
}

const validateFolderState = (folders: MovableFolder[]): MoveValidationResult => {
    if (folders.some(folder => folder.deletedAt !== null)) {
        return {
            isValid: false,
            error: {
                field: 'folderIds',
                message: 'CANNOT_MOVE_DELETED_FOLDERS'
            }
        }
    }

    return { isValid: true }
}

const validateTargetFolder = (targetFolder: Folder | undefined): MoveValidationResult => {
    if (!targetFolder) {
        return {
            isValid: false,
            error: {
                field: 'folderId',
                message: 'FOLDER_NOT_FOUND'
            }
        }
    }

    if (targetFolder.deletedAt !== null) {
        return {
            isValid: false,
            error: {
                field: 'folderId',
                message: 'CANNOT_MOVE_FILES_TO_DELETED_FOLDER'
            }
        }
    }

    return { isValid: true }
}

const validateCircularDependency = async (folderIds: string[], targetFolderId: string): Promise<MoveValidationResult> => {
    const parentFolders = await FolderRepository.findFolderAncestorsById(targetFolderId)
    const parentFolderIds = new Set(parentFolders.map(folder => folder.id))

    if (folderIds.some(id => parentFolderIds.has(id))) {
        return {
            isValid: false,
            error: {
                field: 'folderIds',
                message: 'CANNOT_MOVE_FOLDERS_TO_ITS_OWN_SUBTREE'
            }
        }
    }

    return { isValid: true }
}

export const moveFolders = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await moveFolderSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds, folderId, workspaceId } = validation.data

    const workspace = await WorkspaceRepository.getWithFolder(workspaceId, folderId)
	
    if (!workspace) {
        return ResponseHandler.validationError(req, res, {
            workspaceId: 'WORKSPACE_NOT_FOUND'
        })
    }
	
    if (folderId && (!workspace.folders || workspace.folders.length === 0)) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_NOT_FOUND'
        })
    }

    const hasPermission = await filePolicy.canMoveFiles(user, workspaceId)

    if (!hasPermission) {
        return ResponseHandler.forbidden(res)
    }

    const foldersToMove = await FolderRepository.findFoldersByIdsWithWorkspace(folderIds)

    if (!foldersToMove.length) {
        return ResponseHandler.json(res, { folders: [] })
    }

    const workspaceValidation = await validateWorkspaceAccess(foldersToMove, workspaceId)

    if (!workspaceValidation.isValid) {
        return ResponseHandler.validationError(req, res, {
            [workspaceValidation.error!.field]: workspaceValidation.error!.message
        })
    }

    const folderStateValidation = validateFolderState(foldersToMove)

    if (!folderStateValidation.isValid) {
        return ResponseHandler.validationError(req, res, {
            [folderStateValidation.error!.field]: folderStateValidation.error!.message
        })
    }

    if (folderId) {
        const targetFolder = (workspace.folders && workspace.folders.length > 0) ? workspace.folders[0] : undefined
        const targetValidation = validateTargetFolder(targetFolder)

        if (!targetValidation.isValid) {
            return ResponseHandler.validationError(req, res, {
                [targetValidation.error!.field]: targetValidation.error!.message
            })
        }

        const circularDepValidation = await validateCircularDependency(folderIds, folderId)

        if (!circularDepValidation.isValid) {
            return ResponseHandler.validationError(req, res, {
                [circularDepValidation.error!.field]: circularDepValidation.error!.message
            })
        }
    }

    const updatedFolders = await FolderRepository.updateFoldersParent(folderIds, folderId || null)

    return ResponseHandler.json(res, { folders: updatedFolders })
}