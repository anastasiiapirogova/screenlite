import { AuthContext } from '@/core/types/auth-context.type.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '../../domain/dto/global-workspace-invitations-query-options.dto.ts'

export type GetGlobalWorkspaceInvitationsDTO = {
    authContext: AuthContext
    queryOptions: GlobalWorkspaceInvitationsQueryOptionsDTO
}