import { Workspace } from '@/core/entities/workspace.entity.ts'
import { IWorkspaceRepository } from '../ports/workspace-repository.interface.ts'
import { CreateWorkspaceDTO } from '../dto/create-workspace.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { WorkspaceFactory } from '@/core/factories/workspace.factory.ts'

export class WorkspaceCreationService {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
    ) {}

    async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
        const { name, slug } = dto

        const existingWorkspace = await this.workspaceRepository.findBySlug(slug)

        if (existingWorkspace) {
            throw new ValidationError({
                slug: ['SLUG_ALREADY_EXISTS']
            })
        }

        const workspace = WorkspaceFactory.create({
            name,
            slug
        })

        await this.workspaceRepository.save(workspace)

        return workspace
    }
}