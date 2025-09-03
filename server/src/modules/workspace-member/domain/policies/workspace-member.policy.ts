import { WorkspaceAccess } from '@/modules/workspace/domain/value-objects/workspace-access.vo.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { WorkspaceMemberListPolicy } from './workspace-member-list.policy.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class WorkspaceMemberPolicy {
    static canViewWorkspaceMember(
        authContext: AuthContext, 
        workspaceAccess: WorkspaceAccess
    ): boolean {
        WorkspaceMemberListPolicy.enforceViewWorkspaceMembers(authContext, workspaceAccess)

        if(WorkspaceMemberListPolicy.canViewAllWorkspaceMembers(authContext)) {
            return true
        }
 
        return workspaceAccess.hasAccess
    }

    static enforceViewWorkspaceMember(
        authContext: AuthContext, 
        workspaceAccess: WorkspaceAccess
    ): void {
        if (!this.canViewWorkspaceMember(authContext, workspaceAccess)) {
            throw new ForbiddenError({
                details: {
                    permissions: ['YOU_CANNOT_VIEW_WORKSPACE_MEMBERS']
                }
            })
        }
    }

    static canLeaveWorkspace(workspaceAccess: WorkspaceAccess): boolean {
        return workspaceAccess.member !== null
    }

    static enforceLeaveWorkspace(workspaceAccess: WorkspaceAccess): void {
        if (!this.canLeaveWorkspace(workspaceAccess)) {
            throw new ForbiddenError({
                details: {
                    workspace: ['YOU_CANNOT_LEAVE_WORKSPACE']
                }
            })
        }
    }
}