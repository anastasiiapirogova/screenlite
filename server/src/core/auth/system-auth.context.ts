import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { SYSTEM_ADMIN_PERMISSIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class SystemAuthContext extends AbstractAuthContext {
    constructor() {
        super(AuthContextType.System)
    }

    getAdminPermissions(): AdminPermissionName[] {
        return SYSTEM_ADMIN_PERMISSIONS
    }

    override hasAdminAccess(): boolean {
        return true
    }
}