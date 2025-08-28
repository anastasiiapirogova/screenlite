import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspacesQueryOptionsDTO } from '../dto/workspaces-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'

export interface IWorkspaceRepository {
    findById(id: string): Promise<Workspace | null>
    findBySlug(slug: string): Promise<Workspace | null>
    findAll(queryOptions?: WorkspacesQueryOptionsDTO): Promise<PaginationResponse<Workspace>>
    save(workspace: Workspace): Promise<void>
    delete(id: string): Promise<void>
}