import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { User } from '@/core/entities/user.entity.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { SYSTEM_ADMIN_PERMISSIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class UserSessionAuthContext extends AbstractAuthContext {
    constructor(
        public readonly user: User,
        private readonly _session: Session,
        public readonly twoFactorAuthEnabled: boolean,
    ) {
        super(AuthContextType.UserSession)
    }

    getAdminPermissions(): AdminPermissionName[] {
        if (this.user.isSuperAdmin) {
            return SYSTEM_ADMIN_PERMISSIONS.map(p => p.name)
        } else {
            return this._adminPermissions
        }
    }

    isTwoFactorAuthenticated(): boolean {
        return this.twoFactorAuthEnabled && this.session.twoFactorAuthenticatedAt !== null
    }

    override hasAdminAccess(): boolean {
        return this.user.hasAdminAccess
    }

    override get session(): Session {
        return this._session
    }
}