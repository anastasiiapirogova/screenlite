import { Request, Response } from 'express'
import { moveFilesSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { FileRepository } from '../repositories/FileRepository.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { Folder } from 'generated/prisma/client.js'

type MovableFile = {
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

const validateWorkspaceAccess = async (files: MovableFile[], targetWorkspaceId?: string): Promise<MoveValidationResult> => {
    const fileWorkspaceIds = new Set(files.map(file => file.workspaceId))
	
    if (fileWorkspaceIds.size !== 1 || !targetWorkspaceId || !fileWorkspaceIds.has(targetWorkspaceId)) {
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

export const moveFiles = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await moveFilesSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileIds, folderId, workspaceId } = validation.data

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

    const filesToMove = await FileRepository.findActiveFilesByIds(fileIds)

    if (!filesToMove.length) {
        return ResponseHandler.json(res, { files: [] })
    }

    const workspaceAccessValidation = await validateWorkspaceAccess(filesToMove, workspaceId)

    if (!workspaceAccessValidation.isValid) {
        return ResponseHandler.validationError(req, res, {
            [workspaceAccessValidation.error!.field]: workspaceAccessValidation.error!.message
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
    }

    const updatedFiles = await FileRepository.moveFilesToFolder(fileIds, folderId || null)

    return ResponseHandler.json(res, { files: updatedFiles })
}
