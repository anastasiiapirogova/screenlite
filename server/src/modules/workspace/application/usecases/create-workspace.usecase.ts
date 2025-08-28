import { CreateWorkspaceDTO } from '../dto/create-workspace.dto.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { WorkspaceCreationServiceFactory } from '../../domain/services/workspace-creation-service.factory.ts'
import { WorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'

export class CreateWorkspaceUsecase {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly workspaceCreationServiceFactory: WorkspaceCreationServiceFactory,
        private readonly workspaceMemberServiceFactory: WorkspaceMemberServiceFactory
    ) {}

    async execute(dto: CreateWorkspaceDTO): Promise<Workspace> {
        const { name, slug, authContext } = dto

        const workspacePolicy = new WorkspacePolicy(authContext)

        workspacePolicy.enforceCreateWorkspace()

        let creatorUserId: string | undefined

        if (authContext.isUserContext()) {
            creatorUserId = authContext.user.id
        }

        const workspace = await this.unitOfWork.execute(async (repos) => {
            const workspaceCreationService = this.workspaceCreationServiceFactory({
                workspaceRepository: repos.workspaceRepository,
            })
        
            const workspaceMemberService = this.workspaceMemberServiceFactory({
                workspaceMemberRepository: repos.workspaceMemberRepository,
                userRepository: repos.userRepository,
                workspaceRepository: repos.workspaceRepository
            })
        
            const workspace = await workspaceCreationService.createWorkspace({ name, slug })
        
            if (creatorUserId) {
                await workspaceMemberService.addMember(workspace.id, creatorUserId)
            }
        
            return workspace
        })

        return workspace
    }
}