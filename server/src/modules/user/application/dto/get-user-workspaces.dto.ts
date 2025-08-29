import { AuthContext } from '@/core/types/auth-context.type.ts'
import { UserWorkspacesQueryOptionsDTO } from '../../domain/dto/user-workspaces-query-options.dto.ts'

export type GetUserWorkspacesDTO = {
    userId: string
    authContext: AuthContext
    queryOptions: UserWorkspacesQueryOptionsDTO
}