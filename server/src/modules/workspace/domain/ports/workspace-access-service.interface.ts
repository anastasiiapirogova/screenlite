import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceAccess } from '../value-objects/workspace-access.vo.ts'

export type IWorkspaceAccessService = {
    checkAccess(workspaceId: string, authContext: AuthContext): Promise<WorkspaceAccess>
}