import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceMembersQueryOptionsDTO } from '../../domain/dto/workspace-members-query-options.dto.ts'

export type GetWorkspaceMembersByWorkspaceDTO = {
    authContext: AuthContext
    queryOptions: WorkspaceMembersQueryOptionsDTO
}