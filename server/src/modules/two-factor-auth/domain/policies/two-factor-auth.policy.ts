import { User } from '@/core/entities/user.entity.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class TwoFactorAuthPolicy {
    constructor(
        private readonly user: User,
        private readonly authContext: AuthContext
    ) {}

    private isSelf(): boolean {
        if(this.authContext.isUserContext()) {
            const authUser = this.authContext.user

            return authUser.id === this.user.id
        }

        return false
    }

    canCompleteTotpSetup(): boolean {
        if(this.authContext.hasAdminAccess()) {
            const hasAdminPermission = this.authContext.hasAdminPermission(AdminPermissionName.USERS_EDIT)

            if(hasAdminPermission) {
                return true
            }
        }

        if(this.isSelf()) {
            return true
        }

        return false
    }

    enforceCanCompleteTotpSetup(): void {
        if(!this.canCompleteTotpSetup()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_COMPLETE_TOTP_SETUP_FOR_THIS_USER']
            })
        }
    }
} 