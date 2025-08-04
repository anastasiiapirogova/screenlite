import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class WorkspaceApiKeyAuthContext extends AbstractAuthContext {
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