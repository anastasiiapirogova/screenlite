import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class UserPolicy {
    private static isTargetUserSelf(targetUserId: string, authContext: AuthContext): boolean {
        if (!authContext.isUserContext()) {
            return false
        }

        const authenticatedUser = authContext.user

        return authenticatedUser.id === targetUserId
    }

    static canViewProfile(targetUserId: string, authContext: AuthContext): boolean {
        if (authContext.hasAdminPermission(AdminPermissionName.USERS_VIEW)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceViewProfile(targetUserId: string, authContext: AuthContext): void {
        if (!this.canViewProfile(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_USER_PROFILE']
            })
        }
    }

    static canRequestAccountDeletion(targetUserId: string, authContext: AuthContext): boolean {
        if (authContext.hasAdminPermission(AdminPermissionName.USERS_DELETE)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceRequestAccountDeletion(targetUserId: string, authContext: AuthContext): void {
        if (!this.canRequestAccountDeletion(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_REQUEST_ACCOUNT_DELETION']
            })
        }
    }

    static canChangePassword(targetUserId: string, authContext: AuthContext): boolean {
        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceChangePassword(targetUserId: string, authContext: AuthContext): void {
        if (!this.canChangePassword(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_CHANGE_USER_PASSWORD']
            })
        }
    }

    static canUpdateProfile(targetUserId: string, authContext: AuthContext): boolean {
        if (authContext.hasAdminPermission(AdminPermissionName.USERS_EDIT)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceUpdateProfile(targetUserId: string, authContext: AuthContext): void {
        if (!this.canUpdateProfile(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_UPDATE_USER_PROFILE']
            })
        }
    }
    static canViewWorkspaces(targetUserId: string, authContext: AuthContext): boolean {
        if (authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_VIEW)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceViewWorkspaces(targetUserId: string, authContext: AuthContext): void {
        if (!this.canViewWorkspaces(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_USER_WORKSPACES']
            })
        }
    }

    static canViewWorkspaceInvitationsList(targetUserId: string, authContext: AuthContext): boolean {
        if (authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            return true
        }

        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceViewWorkspaceInvitationsList(targetUserId: string, authContext: AuthContext): void {
        if (!this.canViewWorkspaceInvitationsList(targetUserId, authContext)) {
            throw new ForbiddenError({
                userId: ['INSUFFICIENT_PERMISSIONS_TO_VIEW_USER_WORKSPACE_INVITATIONS_LIST']
            })
        }
    }
}