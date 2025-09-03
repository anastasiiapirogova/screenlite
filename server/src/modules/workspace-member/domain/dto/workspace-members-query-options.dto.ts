import { PaginationParams } from '@/core/types/pagination.types.ts'

export type WorkspaceMembersQueryOptionsDTO = {
    filters: {
        name?: string
        email?: string
        workspaceId: string
    }
    pagination?: PaginationParams
}