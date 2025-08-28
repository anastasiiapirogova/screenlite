import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { WorkspaceMemberService } from '@/modules/workspace-member/domain/services/workspace-member.service.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'

type WorkspaceCreationServiceDeps = {
    workspaceMemberService: WorkspaceMemberService
    unitOfWork: IUnitOfWork
}

export class WorkspaceCreationService {
    constructor(
        private readonly deps: WorkspaceCreationServiceDeps
    ) {}

    async createWorkspace(name: string, slug: string, creatorUserId: string): Promise<Workspace> {
        const { workspaceMemberService, unitOfWork } = this.deps

        const workspace = Workspace.create({
            name,
            slug
        })

        await unitOfWork.execute(async (repos) => {
            await repos.workspaceRepository.save(workspace)

            await workspaceMemberService.addMember(workspace.id, creatorUserId, repos.workspaceMemberRepository)
        })

        return workspace
    }
}