import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceInvitationsQueryOptionsDTO } from '../../domain/dto/workspace-invitations-query-options.dto.ts'

export type GetWorkspaceInvitationsDTO = {
    authContext: AuthContext
    queryOptions: WorkspaceInvitationsQueryOptionsDTO
}