import { AuthContext } from '@/core/types/auth-context.type.ts'
import { UserQueryOptions } from '@/core/types/user-query-options.type.ts'

export type GetUsersDto = {
    authContext: AuthContext
    queryOptions: UserQueryOptions
}