import { User } from '@/core/entities/user.entity.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class UserPolicy {
    constructor(private readonly user: User) {}

    canAccess(user: User): boolean {
        return user.id === this.user.id
    }

    canView(user: User, actorAdminPermissions: AdminPermissionName[]): boolean {
        if(user.isAdmin) {
            return actorAdminPermissions.includes(AdminPermissionName.USERS_VIEW)
        }

        if(this.canAccess(user)) {
            return true
        }

        return false
    }

    canRequestDeleteAccount(user: User, actorAdminPermissions: AdminPermissionName[]): boolean {
        if(user.isAdmin) {
            return actorAdminPermissions.includes(AdminPermissionName.USERS_DELETE)
        }

        if(this.canAccess(user)) {
            return true
        }

        return false
    }
}