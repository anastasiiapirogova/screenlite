import { AuthContext } from '@/core/types/auth-context.type.ts'
import { UsersQueryOptionsDTO } from '../../domain/dto/users-query-options.dto.ts'

export type GetUsersDto = {
    authContext: AuthContext
    queryOptions: UsersQueryOptionsDTO
}