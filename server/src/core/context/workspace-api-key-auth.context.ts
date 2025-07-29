import { AuthContext } from '@/core/context/auth-context.abstract.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class WorkspaceApiKeyAuthContext extends AuthContext {
    constructor() {
        super(AuthContextType.WorkspaceApiKey)
    }

    getAdminPermissions(): AdminPermissionName[] {
        return []
    }

    override hasAdminAccess(): boolean {
        return false
    }
}