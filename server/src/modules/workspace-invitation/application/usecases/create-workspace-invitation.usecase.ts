
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { CreateWorkspaceInvitationDTO } from '../dto/create-workspace-invitation.dto.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspaceInvitationPolicy } from '../../domain/policies/workspace-invitation.policy.ts'
import { IWorkspaceInvitationService } from '../../domain/ports/workspace-invitation-service.interface.ts'
import { IInitiatorService } from '@/modules/initiator/domain/ports/initiator-service.interface.ts'
import { IWorkspaceInvariantsService } from '@/modules/workspace/domain/ports/workspace-invariants-service.interface.ts'

type CreateWorkspaceInvitationUsecaseDeps = {
    workspaceInvitationRepository: IWorkspaceInvitationRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
    workspaceInvitationService: IWorkspaceInvitationService
    initiatorService: IInitiatorService
    workspaceInvariantsService: IWorkspaceInvariantsService
}

export class CreateWorkspaceInvitationUsecase {
    constructor(private readonly deps: CreateWorkspaceInvitationUsecaseDeps) {}

    async execute(dto: CreateWorkspaceInvitationDTO) {
        const { workspaceRepository, workspaceAccessService, workspaceInvitationService, initiatorService, workspaceInvariantsService } = this.deps

        const { workspaceId, email, authContext } = dto

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError('Workspace not found')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspace.id, authContext)

        WorkspaceInvitationPolicy.enforceInviteToWorkspace(authContext, workspaceAccess)

        await workspaceInvariantsService.enforceWorkspaceActiveForNonAdmin(workspace, authContext)

        const initiator = await initiatorService.getOrCreateInitiator(authContext)
     
        const workspaceInvitation = await workspaceInvitationService.inviteUser({
            workspaceId,
            email,
            initiatorId: initiator.id
        })

        return workspaceInvitation
    }
}