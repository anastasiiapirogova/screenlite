import { getUserWorkspacePermissions } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { SafeUser } from 'types.js'
import { WORKSPACE_PERMISSIONS, WORKSPACE_ROLES } from '@modules/workspace/constants/permissions.js'
import { UserWorkspace } from 'generated/prisma/client.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'

export const memberPolicy = {
    canViewMembers: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },

    canManageMembers: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },

    canRemoveMember: async (
        currentUserMember: UserWorkspace,
        targetUserMember: UserWorkspace,
        totalMembers: number
    ): Promise<{ allowed: boolean, error?: string }> => {
        const { can } = WorkspacePermissionService.getUserWorkspacePermissions(currentUserMember)
        
        if (!can(WORKSPACE_PERMISSIONS.INVITE_USERS)) {
            return { allowed: false }
        }

        const isTargetOwner = targetUserMember.role === WORKSPACE_ROLES.OWNER

        if (isTargetOwner) {
            if (totalMembers === 1) {
                return { 
                    allowed: false,
                    error: 'CANNOT_REMOVE_LAST_OWNER'
                }
            }

            const isCurrentUserOwner = currentUserMember.role === WORKSPACE_ROLES.OWNER

            if (!isCurrentUserOwner) {
                return { allowed: false }
            }
        }

        return { allowed: true }
    }
}