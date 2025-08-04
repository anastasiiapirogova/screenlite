import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { User } from '@/core/entities/user.entity.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class AdminPermissionPolicy {
    constructor(private readonly authContext: AuthContext) {}

    hasAdminPermissions(required: AdminPermissionName[]): boolean {
        if (!this.authContext.hasAdminAccess()) return false

        const userPerms = this.authContext.getAdminPermissions()

        return required.every(perm => userPerms.includes(perm))
    }

    enforceHasPermissions(required: AdminPermissionName[]): void {
        if (!this.hasAdminPermissions(required)) {
            throw new ForbiddenError({
                admin: ['MISSING_REQUIRED_PERMISSIONS']
            })
        }
    }

    canViewUserPermissions(targetUser: User): boolean {
        if (this.authContext.isUserContext()) {
            const currentUser = this.authContext.user

            return currentUser.id === targetUser.id
        }

        return this.hasAdminPermissions([AdminPermissionName.USERS_MANAGE_ADMIN_PERMISSIONS])
    }

    enforceCanViewUserPermissions(targetUser: User): void {
        if (!this.canViewUserPermissions(targetUser)) {
            throw new ForbiddenError({
                admin: ['CANNOT_VIEW_ADMIN_PERMISSIONS']
            })
        }
    }

    canManageUserPermissions(
        targetUser: User,
        targetUserPermissions: AdminPermissionName[],
        permissionsToSet: AdminPermissionName[]
    ): boolean {
        if (!this.hasAdminPermissions([AdminPermissionName.USERS_MANAGE_ADMIN_PERMISSIONS])) return false
        if (!targetUser.hasAdminAccess) return false

        const actorPerms = this.authContext.getAdminPermissions()

        const adding = permissionsToSet.filter(p => !targetUserPermissions.includes(p))
        const removing = targetUserPermissions.filter(p => !permissionsToSet.includes(p))

        if (adding.some(p => !actorPerms.includes(p))) return false
        if (removing.some(p => !actorPerms.includes(p))) return false

        if (this.authContext.isUserContext()) {
            const currentUser = this.authContext.user

            if (currentUser.id === targetUser.id) return false
            if (!currentUser.isSuperAdmin && targetUser.isSuperAdmin) return false

            return true
        }

        return false
    }

    enforceCanManageUserPermissions(
        targetUser: User,
        targetUserPermissions: AdminPermissionName[],
        permissionsToSet: AdminPermissionName[]
    ): void {
        if (!targetUser.hasAdminAccess) {
            throw new ForbiddenError({
                user: ['TARGET_USER_IS_NOT_AN_ADMIN']
            })
        }

        if (!this.canManageUserPermissions(targetUser, targetUserPermissions, permissionsToSet)) {
            throw new ForbiddenError({
                admin: ['CANNOT_MANAGE_UNOWNED_PERMISSIONS']
            })
        }
    }
}