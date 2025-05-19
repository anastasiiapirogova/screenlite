import { getUserWorkspacePermissions } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { WorkspaceUserInvitation } from '@prisma/client'
import { SafeUser } from 'types.js'

export class WorkspaceUserInvitationPolicy {
    static PERMISSIONS = {
        INVITE_USERS: 'invite_users',
        VIEW_INVITATIONS: 'view_invitations',
    }

    static PERMISSIONS_HIERARCHY = {
        [WorkspaceUserInvitationPolicy.PERMISSIONS.INVITE_USERS]: [WorkspaceUserInvitationPolicy.PERMISSIONS.VIEW_INVITATIONS],
    }

    static async canInviteUsers(user: SafeUser, workspaceId: string): Promise<boolean> {
        return getUserWorkspacePermissions(user, workspaceId)
    }

    static async canCancelInvitation(user: SafeUser, workspaceUserInvitation: WorkspaceUserInvitation): Promise<boolean> {
        return WorkspaceUserInvitationPolicy.canInviteUsers(user, workspaceUserInvitation.workspaceId)
    }

    static async canViewInvitation(user: SafeUser, workspaceUserInvitation: WorkspaceUserInvitation): Promise<boolean> {
        if (user.email === workspaceUserInvitation.email) {
            return true
        }

        return WorkspaceUserInvitationPolicy.canViewInvitations(user, workspaceUserInvitation.workspaceId)
    }

    static async canViewInvitations(user: SafeUser, workspaceId: string): Promise<boolean> {
        return getUserWorkspacePermissions(user, workspaceId)
    }
    
    static async canAcceptInvitation(user: SafeUser, workspaceUserInvitation: WorkspaceUserInvitation): Promise<boolean> {
        return user.email === workspaceUserInvitation.email
    }
    
    static async canDeleteInvitation(user: SafeUser, workspaceUserInvitation: WorkspaceUserInvitation): Promise<boolean> {
        return user.email === workspaceUserInvitation.email
    }
}