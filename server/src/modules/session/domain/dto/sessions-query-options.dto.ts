import { PaginationParams } from '../../../../core/types/pagination.types.ts'

export type SessionsQueryOptionsDTO = {
    filters?: {
        userId?: string
        onlyActive?: boolean
        onlyTerminated?: boolean
    }
    pagination?: PaginationParams
}