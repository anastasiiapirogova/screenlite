import { getUserWorkspacePermissions, getUserWorkspacePermissionsEager } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { Screen, UserWorkspace } from '@prisma/client'
import { SafeUser } from 'types.js'

export const screenPolicy = {
    canDeleteScreen: async (user: SafeUser, screen: Screen): Promise<boolean> => {
        return getUserWorkspacePermissions(user, screen.workspaceId)
    },
    canDeleteScreenEager: async (user: SafeUser, workspace: { members: UserWorkspace[] }): Promise<boolean> => {
        return getUserWorkspacePermissionsEager(user, workspace.members)
    },
    canCreateScreens: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canConnectDevice: async (user: SafeUser, screen: Screen): Promise<boolean> => {
        return getUserWorkspacePermissions(user, screen.workspaceId)
    },
    canViewScreen: async (user: SafeUser, screen: Screen): Promise<boolean> => {
        return getUserWorkspacePermissions(user, screen.workspaceId)
    },
    canViewScreens: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
}