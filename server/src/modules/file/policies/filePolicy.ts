import { getUserWorkspacePermissions } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { SafeUser } from 'types.js'

export const filePolicy = {
    canUploadFilePart: async (user: SafeUser, sessionUserId: string, workspaceId: string): Promise<boolean> => {
        const isUserInWorkspace = getUserWorkspacePermissions(user, workspaceId)

        if (!isUserInWorkspace) return false

        if (user.id !== sessionUserId) return false

        return true
    },
    canUpdateFolders: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return filePolicy.canUpdateFiles(user, workspaceId)
    },
    canViewFolders: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return filePolicy.canViewFiles(user, workspaceId)
    },
    canUpdateFiles: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canDeleteFolders: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return filePolicy.canDeleteFiles(user, workspaceId)
    },
    canDeleteFiles: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canUploadFiles: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canViewFiles: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canCreateFolders: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canMoveFiles: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    }
}