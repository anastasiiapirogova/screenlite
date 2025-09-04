import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { SYSTEM_ADMIN_PERMISSIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthUser } from '../value-objects/auth-user.vo.ts'
import { AuthSession } from '../value-objects/auth-session.vo.ts'

export class UserSessionAuthContext extends AbstractAuthContext {
    constructor(
        public readonly user: AuthUser,
        private readonly _session: AuthSession,
    ) {
        super(AuthContextType.UserSession)
    }

    getAdminPermissions(): AdminPermissionName[] {
        if (this.user.isSuperAdmin) {
            return SYSTEM_ADMIN_PERMISSIONS
        } else {
            return this._adminPermissions
        }
    }

    get pendingTwoFactorAuth(): boolean {
        return this.session.pendingTwoFactorAuth
    }

    override hasAdminAccess(): boolean {
        return this.user.hasAdminAccess
    }

    override get session(): AuthSession {
        return this._session
    }
}