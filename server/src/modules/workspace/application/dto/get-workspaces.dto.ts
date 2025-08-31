import { AuthContext } from '@/core/types/auth-context.type.ts'
import { WorkspacesQueryOptionsDTO } from '../../domain/dto/workspaces-query-options.dto.ts'

export type GetWorkspacesDto = {
    authContext: AuthContext
    queryOptions: WorkspacesQueryOptionsDTO
}