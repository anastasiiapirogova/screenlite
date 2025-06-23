import { Folder } from '@/generated/prisma/client.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

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

export class FileMoveService {
    static async validateMove(
        files: MovableFile[],
        targetWorkspaceId: string,
        targetFolderId: string | null
    ): Promise<MoveValidationResult> {
        const workspaceValidation = this.validateWorkspaceAccess(files, targetWorkspaceId)

        if (!workspaceValidation.isValid) return workspaceValidation

        if (targetFolderId) {
            const targetFolder = await FolderRepository.findFolder(targetFolderId, targetWorkspaceId)
            const targetValidation = this.validateTargetFolder(targetFolder)

            if (!targetValidation.isValid) return targetValidation
        }

        return { isValid: true }
    }

    private static validateWorkspaceAccess(files: MovableFile[], targetWorkspaceId: string): MoveValidationResult {
        const fileWorkspaceIds = new Set(files.map(file => file.workspaceId))

        if (fileWorkspaceIds.size !== 1 || !fileWorkspaceIds.has(targetWorkspaceId)) {
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

    private static validateTargetFolder(targetFolder: Folder | null): MoveValidationResult {
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
} 