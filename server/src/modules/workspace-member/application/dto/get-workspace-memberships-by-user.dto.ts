import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspaceMembershipsByUserQueryOptionsDTO } from '../../domain/dto/workspace-memberships-by-user-query-options.dto.ts'

export type GetWorkspaceMembershipsByUserDTO = {
    userId: string
    authContext: AuthContext
    queryOptions: WorkspaceMembershipsByUserQueryOptionsDTO
}