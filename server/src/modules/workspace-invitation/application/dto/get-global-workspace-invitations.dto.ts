import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceInvitationsQueryOptionsDTO } from '../../domain/dto/workspace-invitations-query-options.dto.ts'

export type GetGlobalWorkspaceInvitationsDTO = {
    authContext: AuthContext
    queryOptions: WorkspaceInvitationsQueryOptionsDTO
}