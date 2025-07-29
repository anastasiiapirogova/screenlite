import { AuthContextAbstract } from '@/core/context/auth-context.abstract.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { User } from '@/core/entities/user.entity.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { SYSTEM_ADMIN_PERMISSIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class UserSessionAuthContext extends AuthContextAbstract {
    constructor(
        public readonly user: User,
        public readonly session: Session,
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

    override hasAdminAccess(): boolean {
        return this.user.hasAdminAccess
    }
}