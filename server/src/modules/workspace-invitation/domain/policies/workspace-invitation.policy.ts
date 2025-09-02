import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceAccess } from '@/modules/workspace/domain/value-objects/workspace-access.vo.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspaceInvitationPolicy {
    static canInviteToWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_CREATE)) {
            return true
        }

        if(workspaceAccess.hasAccess) {
            return true
        }

        return false
    }

    static enforceInviteToWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspaceInvitationPolicy.canInviteToWorkspace(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_INVITE_TO_WORKSPACE']
            })
        }
    }

    static canCancelWorkspaceInvitation(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_CANCEL)) {
            return true
        }
        
        if(workspaceAccess.hasAccess) {
            return true
        }

        return false
    }

    static enforceCancelWorkspaceInvitation(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspaceInvitationPolicy.canCancelWorkspaceInvitation(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_CANCEL_WORKSPACE_INVITATION']
            })
        }
    }

    static canRespondToWorkspaceInvitation(authContext: AuthContext, invitationEmail: string): boolean {
        if(authContext.isUserContext()) {
            return authContext.user.email === invitationEmail
        }
        
        return false
    }

    static enforceRespondToWorkspaceInvitation(authContext: AuthContext, invitationEmail: string): void {
        if(!WorkspaceInvitationPolicy.canRespondToWorkspaceInvitation(authContext, invitationEmail)) {
            throw new ForbiddenError({
                invitationEmail: ['INSUFFICIENT_PERMISSIONS_TO_ACCEPT_WORKSPACE_INVITATION']
            })
        }
    }

    static canViewWorkspaceInvitation(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            return true
        }

        if(workspaceAccess.hasAccess) {
            return true
        }

        return false
    }

    static enforceViewWorkspaceInvitation(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspaceInvitationPolicy.canViewWorkspaceInvitation(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_WORKSPACE_INVITATION']
            })
        }
    }
}   