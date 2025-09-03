import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceAccess } from '@/modules/workspace/domain/value-objects/workspace-access.vo.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspaceMemberListPolicy {
    private static isTargetUserSelf(targetUserId: string, authContext: AuthContext): boolean {
        if(!authContext.isUserContext()) {
            return false
        }

        return authContext.user.id === targetUserId
    }

    static canViewAllWorkspaceMembers(authContext: AuthContext): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_MEMBERS_VIEW)) {
            return true
        }

        return false
    }

    static enforceViewAllWorkspaceMembers(authContext: AuthContext): void {
        if (!this.canViewAllWorkspaceMembers(authContext)) {
            throw new ForbiddenError({
                details: {
                    permissions: ['YOU_CANNOT_VIEW_ALL_WORKSPACE_MEMBERS']
                }
            })
        }
    }

    static canViewWorkspaceMembers(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(this.canViewAllWorkspaceMembers(authContext)) {
            return true
        }

        return workspaceAccess.hasAccess
    }

    static enforceViewWorkspaceMembers(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if (!this.canViewWorkspaceMembers(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                details: {
                    workspaceId: ['YOU_CANNOT_VIEW_WORKSPACE_MEMBERS']
                }
            })
        }
    }

    static canViewWorkspaceMembersByUser(authContext: AuthContext, userId: string): boolean {
        if(this.canViewAllWorkspaceMembers(authContext)) {
            return true
        }

        return this.isTargetUserSelf(userId, authContext)
    }
    
    static enforceViewWorkspaceMembersByUser(authContext: AuthContext, userId: string): void {
        if (!this.canViewWorkspaceMembersByUser(authContext, userId)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_WORKSPACE_MEMBERS_BY_USER']
                }
            })
        }
    }
}