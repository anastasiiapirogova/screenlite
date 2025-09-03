import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { PaginationParams } from '@/core/types/pagination.types.ts'

export type WorkspacesQueryOptionsDTO = {
    filters?: {
        name?: string
        slug?: string
        status?: WorkspaceStatus[]
    }
    pagination?: PaginationParams
}