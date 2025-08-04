import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class AdminApiKeyAuthContext extends AbstractAuthContext {
    constructor() {
        super(AuthContextType.AdminApiKey)
    }

    getAdminPermissions(): AdminPermissionName[] {
        return this._adminPermissions
    }

    override hasAdminAccess(): boolean {
        return true
    }
}