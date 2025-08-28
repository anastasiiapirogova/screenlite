import { AuthContext } from '@/core/types/auth-context.type.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspacePolicy {
    constructor(
        private readonly authContext: AuthContext
    ) {}

    canCreateWorkspace(): boolean {
        if(this.authContext.hasAdminAccess()) {
            if(this.authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_CREATE)) {
                return true
            }
        }

        if(this.authContext.isUserContext()) {
            return true
        }

        return false
    }

    enforceCreateWorkspace(): void {
        if(!this.canCreateWorkspace()) {
            throw new ForbiddenError({}, 'Workspace creation not allowed')
        }
    }
}