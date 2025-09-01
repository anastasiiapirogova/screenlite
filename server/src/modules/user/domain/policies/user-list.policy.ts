import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class UserListPolicy {
    static canViewAllUsers(authContext: AuthContext): boolean {
        return authContext.hasAdminPermission(AdminPermissionName.USERS_VIEW)
    }

    static enforceViewAllUsers(authContext: AuthContext): void {
        if(!UserListPolicy.canViewAllUsers(authContext)) {
            throw new ForbiddenError({
                permissions: ['YOU_CANNOT_VIEW_ALL_USERS']
            })
        }
    }
}