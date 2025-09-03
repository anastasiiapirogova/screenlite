import { Workspace } from '@/core/entities/workspace.entity.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { IWorkspaceInvariantsService } from '../ports/workspace-invariants-service.interface.ts'

export class WorkspaceInvariantsService implements IWorkspaceInvariantsService {
    constructor() {}

    async enforceWorkspaceActiveForNonAdmin(
        workspace: Workspace,
        authContext: AuthContext,
    ): Promise<void> {
        if (authContext.hasAdminAccess()) {
            return
        }

        if (!workspace.state.isActive()) {
            throw new ForbiddenError({
                code: 'WORKSPACE_INACTIVE',
                message: 'Workspace is inactive and requires global admin privileges to perform this action',
                details: { workspaceId: workspace.id }
            })
        }
    }

    async enforceWorkspaceActive(
        workspace: Workspace,
    ): Promise<void> {
        if (!workspace.state.isActive()) {
            throw new ForbiddenError({
                code: 'WORKSPACE_INACTIVE',
                message: 'Workspace is inactive',
                details: { workspaceId: workspace.id }
            })
        }
    }
}