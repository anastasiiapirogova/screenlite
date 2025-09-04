import { Workspace } from '@/core/entities/workspace.entity.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export interface IWorkspaceInvariantsService {
    enforceWorkspaceActiveForNonAdmin(
        workspace: Workspace,
        authContext: AuthContext,
    ): Promise<void>

    enforceWorkspaceActive(
        workspace: Workspace,
    ): Promise<void>

    enforceWorkspaceIsNotDeleted(
        workspace: Workspace,
        authContext: AuthContext,
    ): Promise<void>
}