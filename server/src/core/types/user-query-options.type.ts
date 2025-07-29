import { UserRole } from '../enums/user-role.enum.ts'
import { PaginationParams } from './pagination.types.ts'

export type UserQueryOptions = {
    filters?: {
        email?: string
        roles?: UserRole[]
    }
    pagination?: PaginationParams
}