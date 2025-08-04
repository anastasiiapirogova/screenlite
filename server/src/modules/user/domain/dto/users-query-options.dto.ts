import { UserRole } from '../../../../core/enums/user-role.enum.ts'
import { PaginationParams } from '../../../../core/types/pagination.types.ts'

export type UsersQueryOptionsDTO = {
    filters?: {
        email?: string
        roles?: UserRole[]
    }
    pagination?: PaginationParams
}