import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class WorkspaceListPolicy {
    static canViewAllWorkspaces(authContext: AuthContext): boolean {
        return authContext.hasAdminPermission(AdminPermissionName.WORKSPACES_VIEW)
    }

    static enforceViewAllWorkspaces(authContext: AuthContext): void {
        if(!WorkspaceListPolicy.canViewAllWorkspaces(authContext)) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_VIEW_ALL_WORKSPACES']
            })
        }
    }
}