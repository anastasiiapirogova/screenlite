import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { WorkspaceMemberWithUserView } from '@/modules/workspace-member/presentation/view-models/workspace-member-with-user.view.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { WorkspaceMemberListPolicy } from '../../domain/policies/workspace-member-list.policy.ts'
import { GetWorkspaceMembersByWorkspaceDTO } from '../dto/get-workspace-members-by-workspace.dto.ts'

type GetWorkspaceMembersByWorkspaceUsecaseDeps = {
    workspaceMemberRepository: IWorkspaceMemberRepository
    workspaceRepository: IWorkspaceRepository
    workspaceAccessService: IWorkspaceAccessService
}

export class GetWorkspaceMembersByWorkspaceUsecase {
    constructor(private readonly deps: GetWorkspaceMembersByWorkspaceUsecaseDeps) {}

    async execute(dto: GetWorkspaceMembersByWorkspaceDTO): Promise<PaginationResponse<WorkspaceMemberWithUserView>> {
        const { workspaceMemberRepository, workspaceRepository, workspaceAccessService } = this.deps

        const { authContext, queryOptions } = dto
        const { workspaceId } = queryOptions.filters

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError('WORKSPACE_NOT_FOUND')
        }

        const access = await workspaceAccessService.checkAccess(workspaceId, authContext)

        WorkspaceMemberListPolicy.enforceViewWorkspaceMembers(authContext, access)

        return workspaceMemberRepository.findByWorkspace(queryOptions)
    }
}