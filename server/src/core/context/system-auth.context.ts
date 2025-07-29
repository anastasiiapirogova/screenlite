import { AuthContext } from '@/core/context/auth-context.abstract.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { SYSTEM_ADMIN_PERMISSIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class SystemAuthContext extends AuthContext {
    constructor() {
        super(AuthContextType.System)
    }

    getAdminPermissions(): AdminPermissionName[] {
        return SYSTEM_ADMIN_PERMISSIONS.map(p => p.name)
    }

    override hasAdminAccess(): boolean {
        return true
    }
}