import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { Workspace as PrismaWorkspace } from '@/generated/prisma/client.ts'

export class PrismaRepositoryWorkspaceMapper {
    static toDomain(prismaWorkspace: PrismaWorkspace): Workspace {
        return new Workspace({
            id: prismaWorkspace.id,
            name: prismaWorkspace.name,
            slug: prismaWorkspace.slug,
            status: prismaWorkspace.status as WorkspaceStatus,
            createdAt: prismaWorkspace.createdAt,
            updatedAt: prismaWorkspace.updatedAt,
            deletedAt: prismaWorkspace.deletedAt,
            picturePath: prismaWorkspace.picturePath,
        })
    }

    static toPersistence(workspace: Workspace): Omit<PrismaWorkspace, 'createdAt' | 'updatedAt'> {
        return {
            id: workspace.id,
            name: workspace.name.value,
            slug: workspace.slug.value,
            status: workspace.status,
            picturePath: workspace.picturePath,
            deletedAt: workspace.deletedAt,
        }
    }
}