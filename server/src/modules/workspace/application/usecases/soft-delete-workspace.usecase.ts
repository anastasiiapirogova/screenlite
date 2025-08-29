import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { WorkspacePolicy } from '../../domain/policies/workspace.policy.ts'

interface SoftDeleteWorkspaceUsecaseDeps {
    workspaceRepository: IWorkspaceRepository
    workspaceMemberService: IWorkspaceMemberService
}

export class SoftDeleteWorkspaceUsecase {
    constructor(private readonly deps: SoftDeleteWorkspaceUsecaseDeps) {}

    async execute(workspaceId: string, authContext: AuthContext) {
        const { workspaceRepository, workspaceMemberService } = this.deps

        let isMember = false

        const workspace = await workspaceRepository.findById(workspaceId)
        
        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        if(authContext.isUserContext()) {
            const member = await workspaceMemberService.findMember(workspaceId, authContext.user.id)

            isMember = !!member
        }

        WorkspacePolicy.enforceSoftDeleteWorkspace(authContext, isMember)

        if (workspace.state.isDeleted()) {
            throw new ValidationError({
                workspaceId: ['WORKSPACE_ALREADY_DELETED']
            })
        }

        workspace.state.markAsDeleted()

        await this.deps.workspaceRepository.save(workspace)

        return workspace
    }
}