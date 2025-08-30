import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspacePolicy {
    static canViewWorkspace(authContext: AuthContext, isMember: boolean): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_VIEW)) {
            return true
        }

        if(isMember) {
            return true
        }

        return false
    }

    static enforceViewWorkspace(authContext: AuthContext, isMember: boolean): void {
        if(!WorkspacePolicy.canViewWorkspace(authContext, isMember)) {
            throw new ForbiddenError({
                workspaceId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_WORKSPACE']
            })
        }
    }

    static canSoftDeleteWorkspace(authContext: AuthContext, isMember: boolean): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_SOFT_DELETE)) {
            return true
        }

        if(isMember) {
            return true
        }

        return false
    }

    static enforceSoftDeleteWorkspace(authContext: AuthContext, isMember: boolean): void {
        if(!WorkspacePolicy.canSoftDeleteWorkspace(authContext, isMember)) {
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
}