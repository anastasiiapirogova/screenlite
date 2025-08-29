import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspaceDTO } from '@/shared/dto/workspace.dto.ts'

export class WorkspaceMapper {
    toDTO(workspace: Workspace): WorkspaceDTO {
        return {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            status: workspace.state.status,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            deletedAt: workspace.state.deletedAt,
            picturePath: workspace.picturePath
        }
    }
}