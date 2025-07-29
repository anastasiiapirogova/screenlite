import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/core/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class UserListPolicy {
    constructor(
        private readonly authContext: AuthContext
    ) {}

    canViewAllUsers(): boolean {
        if(this.authContext.hasAdminAccess()) {
            const hasAdminPermission = this.authContext.hasAdminPermission(AdminPermissionName.USERS_VIEW)

            if(hasAdminPermission) {
                return true
            }
        }

        return false
    }

    enforceViewAllUsers(): void {
        if(!this.canViewAllUsers()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_VIEW_ALL_USERS']
            })
        }
    }
}