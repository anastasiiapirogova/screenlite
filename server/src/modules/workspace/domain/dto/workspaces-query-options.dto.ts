import { PaginationParams } from '@/core/types/pagination.types.ts'

export type WorkspacesQueryOptionsDTO = {
    filters?: {
        name?: string
        slug?: string
    }
    pagination?: PaginationParams
}