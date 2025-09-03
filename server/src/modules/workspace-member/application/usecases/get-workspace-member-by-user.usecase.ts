import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { GetWorkspaceMemberByUserDTO } from '@/modules/workspace-member/application/dto/get-workspace-member-by-user.dto.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspaceMemberPolicy } from '../../domain/policies/workspace-member.policy.ts'

type GetWorkspaceMemberByUserUsecaseDeps = {
    workspaceMemberRepository: IWorkspaceMemberRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
}

export class GetWorkspaceMemberByUserUsecase {
    constructor(private readonly deps: GetWorkspaceMemberByUserUsecaseDeps) {}

    async execute(dto: GetWorkspaceMemberByUserDTO) {
        const { workspaceMemberRepository, workspaceRepository, workspaceAccessService } = this.deps
        const { userId, authContext, workspaceId } = dto

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        const workspaceAccess = await workspaceAccessService.checkAccess(workspaceId, authContext)

        WorkspaceMemberPolicy.enforceViewWorkspaceMember(authContext, workspaceAccess)

        const workspaceMember = await workspaceMemberRepository.findByWorkspaceAndUser(userId, workspaceId)

        if (!workspaceMember) {
            throw new NotFoundError('WORKSPACE_MEMBER_NOT_FOUND')
        }

        return workspaceMember
    }
}