import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspacesQueryOptionsDTO } from '../dto/workspaces-query-options.dto.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'

export interface IWorkspacesQuery {
    handle(queryOptions: WorkspacesQueryOptionsDTO): Promise<PaginationResponse<Workspace>>
}