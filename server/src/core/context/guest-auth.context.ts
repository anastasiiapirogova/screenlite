import { AuthContextAbstract } from '@/core/context/auth-context.abstract.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class GuestAuthContext extends AuthContextAbstract {
    constructor() {
        super(AuthContextType.Guest)
    }

    getAdminPermissions(): AdminPermissionName[] {
        return []
    }

    override hasAdminAccess(): boolean {
        return false
    }
}