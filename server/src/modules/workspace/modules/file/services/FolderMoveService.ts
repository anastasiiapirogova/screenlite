import { Folder } from '@/generated/prisma/client.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { MAX_FOLDER_DEPTH } from '@/config/files.js'

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

export class FolderMoveService {
    static async validateMove(
        folders: MovableFolder[],
        targetWorkspaceId: string,
        targetFolderId: string | null
    ): Promise<MoveValidationResult> {
        const workspaceValidation = this.validateWorkspaceAccess(folders, targetWorkspaceId)

        if (!workspaceValidation.isValid) return workspaceValidation

        const folderStateValidation = this.validateFolderState(folders)

        if (!folderStateValidation.isValid) return folderStateValidation

        if (targetFolderId) {
            const targetFolder = await FolderRepository.findFolder(targetFolderId, targetWorkspaceId)
            const targetValidation = this.validateTargetFolder(targetFolder)

            if (!targetValidation.isValid) return targetValidation

            const circularDepValidation = await this.validateCircularDependency(folders.map(f => f.id), targetFolderId)

            if (!circularDepValidation.isValid) return circularDepValidation

            const depthValidation = await this.validateFolderDepthWithSubfolders(targetWorkspaceId, targetFolderId, folders.map(f => f.id))

            if (!depthValidation.isValid) return depthValidation
        }

        return { isValid: true }
    }

    static async validateFolderDepthWithSubfolders(workspaceId: string, targetFolderId: string, folderIds: string[]): Promise<MoveValidationResult> {
        const targetDepth = await FolderRepository.calculateFolderDepth(workspaceId, targetFolderId)

        for (const folderId of folderIds) {
            const subtreeDepth = await FolderRepository.findMaxSubfolderDepth(folderId)
            const newDepth = targetDepth + 1 + subtreeDepth

            if (newDepth >= MAX_FOLDER_DEPTH) {
                return {
                    isValid: false,
                    error: {
                        field: 'folderIds',
                        message: 'MOVE_WOULD_EXCEED_MAX_DEPTH'
                    }
                }
            }
        }

        return { isValid: true }
    }

    private static validateWorkspaceAccess(folders: MovableFolder[], targetWorkspaceId: string): MoveValidationResult {
        const folderWorkspaceIds = new Set(folders.map(folder => folder.workspaceId))
        
        if (folderWorkspaceIds.size !== 1 || !folderWorkspaceIds.has(targetWorkspaceId)) {
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

    private static validateFolderState(folders: MovableFolder[]): MoveValidationResult {
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

    private static async validateCircularDependency(folderIds: string[], targetFolderId: string): Promise<MoveValidationResult> {
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
} 