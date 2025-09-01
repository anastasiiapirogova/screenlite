
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { InviteToWorkspaceDTO } from '../dto/invite-to-workspace.dto.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspaceInvitationPolicy } from '../../domain/policies/workspace-invitation.policy.ts'
import { IWorkspaceInvitationService } from '../../domain/ports/workspace-invitation-service.interface.ts'

type InviteToWorkspaceUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvitationService: IWorkspaceInvitationService
}

export class InviteToWorkspaceUsecase {
    constructor(private readonly deps: InviteToWorkspaceUsecaseDeps) {}

    async execute(dto: InviteToWorkspaceDTO) {
        const { workspaceRepository, workspaceAccessService, workspaceInvitationService } = this.deps

        const { workspaceId, email, authContext } = dto

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspaceInvitationPolicy.enforceInviteToWorkspace(authContext, workspaceAccess)
     
        const workspaceInvitation = await workspaceInvitationService.inviteUser({
            workspaceId,
            email
        })

        return workspaceInvitation
    }
}