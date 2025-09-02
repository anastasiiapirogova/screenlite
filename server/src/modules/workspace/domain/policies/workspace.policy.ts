import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { WorkspaceAccess } from '../value-objects/workspace-access.vo.ts'

export class WorkspacePolicy {
    static canViewWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_VIEW)) {
            return true
        }

        if(workspaceAccess.hasAccess) {
            return true
        }

        return false
    }

    static enforceViewWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspacePolicy.canViewWorkspace(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_WORKSPACE']
            })
        }
    }

    static canSoftDeleteWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_SOFT_DELETE)) {
            return true
        }

        if(workspaceAccess.hasAccess) {
            return true
        }

        return false
    }

    static enforceSoftDeleteWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspacePolicy.canSoftDeleteWorkspace(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_SOFT_DELETE_WORKSPACE']
            })
        }
    }

    static canDeleteWorkspace(authContext: AuthContext): boolean {
        return authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_DELETE)
    }

    static enforceDeleteWorkspace(authContext: AuthContext): void {
        if(!WorkspacePolicy.canDeleteWorkspace(authContext)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_DELETE_WORKSPACE']
            })
        }
    }

    static canUpdateWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_UPDATE)) {
            return true
        }

        return workspaceAccess.hasAccess
    }

    static enforceUpdateWorkspace(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspacePolicy.canUpdateWorkspace(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_UPDATE_WORKSPACE']
            })
        }
    }

    static canViewInvitations(authContext: AuthContext, workspaceAccess: WorkspaceAccess): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            return true
        }

        return workspaceAccess.hasAccess
    }

    static enforceViewInvitations(authContext: AuthContext, workspaceAccess: WorkspaceAccess): void {
        if(!WorkspacePolicy.canViewInvitations(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_WORKSPACE_INVITATIONS']
            })
        }
    }
}