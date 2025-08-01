import { User } from '@/core/entities/user.entity.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class UserPolicy {
    constructor(
        private readonly user: User,
        private readonly authContext: AuthContext
    ) {}

    private isSelf(): boolean {
        if(this.authContext.isUserContext()) {
            const user = this.authContext.user

            return user.id === this.user.id
        }

        return false
    }

    canView(): boolean {
        if(this.authContext.hasAdminAccess()) {
            const hasAdminPermission = this.authContext.hasAdminPermission(AdminPermissionName.USERS_VIEW)

            if(hasAdminPermission) {
                return true
            }
        }

        if(this.isSelf()) {
            return true
        }

        return false
    }

    enforceCanView(): void {
        if(!this.canView()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_VIEW_THIS_USER']
            })
        }
    }

    canRequestDeleteAccount(): boolean {
        if(this.authContext.hasAdminAccess()) {
            const hasAdminPermission = this.authContext.hasAdminPermission(AdminPermissionName.USERS_DELETE)

            if(hasAdminPermission) {
                return true
            }
        }

        if(this.isSelf()) {
            return true
        }

        return false
    }

    enforceCanRequestDeleteAccount(): void {
        if(!this.canRequestDeleteAccount()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_REQUEST_DELETION_FOR_THIS_USER']
            })
        }
    }

    canChangePassword(): boolean {
        if(this.authContext.isUserContext()) {
            return this.isSelf()
        }

        return false
    }

    enforceCanChangePassword(): void {
        if(!this.canChangePassword()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_CHANGE_PASSWORD_FOR_THIS_USER']
            })
        }
    }
}