import { WorkspaceMemberService } from '@/modules/workspace-member/domain/services/workspace-member.service.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { IWorkspaceRepository } from '../ports/workspace-repository.interface.ts'
import { CreateWorkspaceDTO } from '../dto/create-workspace.dto.ts'

type WorkspaceCreationServiceDeps = {
    workspaceMemberService: WorkspaceMemberService
    workspaceRepository: IWorkspaceRepository
}

export class WorkspaceCreationService {
    constructor(
        private readonly deps: WorkspaceCreationServiceDeps
    ) {}

    async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
        const { workspaceMemberService, workspaceRepository } = this.deps

        const { name, slug, creatorUserId } = dto

        const workspace = Workspace.create({
            name,
            slug
        })

        await workspaceRepository.save(workspace)

        await workspaceMemberService.addMember(workspace.id, creatorUserId)

        return workspace
    }
}