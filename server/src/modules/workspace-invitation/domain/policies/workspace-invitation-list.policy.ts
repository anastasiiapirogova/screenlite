import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class WorkspaceInvitationListPolicy {
    static canViewAllWorkspaceInvitations(authContext: AuthContext): boolean {
        return authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)
    }

    static enforceViewAllWorkspaceInvitations(authContext: AuthContext): void {
        if (!authContext.hasAdminPermission(AdminPermissionName.WORKSPACE_INVITATIONS_VIEW)) {
            throw new ForbiddenError({
                permissions: ['YOU_CANNOT_VIEW_ALL_WORKSPACE_INVITATIONS']
            })
        }
    }
}