import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceAccess } from '@/modules/workspace/domain/value-objects/workspace-access.vo.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspaceInvitationListPolicy {
    private static isTargetUserSelf(targetUserId: string, authContext: AuthContext): boolean {
        if(!authContext.isUserContext()) {
            return false
        }

        return authContext.user.id === targetUserId
    }

    static canViewAllWorkspaceInvitations(authContext: AuthContext): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            return true
        }

        return false
    }

    static enforceViewAllWorkspaceInvitations(authContext: AuthContext): void {
        if (!this.canViewAllWorkspaceInvitations(authContext)) {
            throw new ForbiddenError({
                details: {
                    permissions: ['YOU_CANNOT_VIEW_ALL_WORKSPACE_INVITATIONS']
                }
            })
        }
    }

    static canViewUserWorkspaceInvitations(authContext: AuthContext, targetUserId: string): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }
    
    static enforceViewUserWorkspaceInvitations(authContext: AuthContext, targetUserId: string): void {
        if(!this.canViewUserWorkspaceInvitations(authContext, targetUserId)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_USER_WORKSPACE_INVITATIONS']
                }
            })
        }
    }

    static canViewWorkspaceInvitations(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(this.canViewAllWorkspaceInvitations(authContext)) {
            return true
        }

        return workspaceAccess.hasAccess
    }
    
    static enforceViewWorkspaceInvitations(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if (!this.canViewWorkspaceInvitations(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                details: {
                    workspaceId: ['YOU_CANNOT_VIEW_WORKSPACE_INVITATIONS']
                }
            })
        }
    }
}