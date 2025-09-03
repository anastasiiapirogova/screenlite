import { AuthContext } from '@/core/types/auth-context.type.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class GlobalWorkspacePolicy {
    static canCreateWorkspace(authContext: AuthContext): boolean {
        if(authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_CREATE)) {
            return true
        }

        if(authContext.isUserContext()) {
            return true
        }

        return false
    }

    static enforceCreateWorkspace(authContext: AuthContext): void {
        if(!GlobalWorkspacePolicy.canCreateWorkspace(authContext)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_CREATE_WORKSPACE']
                }
            })
        }
    }
}