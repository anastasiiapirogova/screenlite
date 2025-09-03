import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceInvitationsByWorkspaceQueryOptionsDTO } from '../../domain/dto/workspace-invitations-by-workspace-query-options.dto.ts'

export type GetWorkspaceInvitationsByWorkspaceDTO = {
    authContext: AuthContext
    queryOptions: WorkspaceInvitationsByWorkspaceQueryOptionsDTO
}