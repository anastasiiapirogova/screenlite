import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceInvitationsWithWorkspaceQuery } from '@/modules/workspace-invitation/domain/ports/workspace-invitations-with-workspace-query.interface.ts'
import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '@/modules/workspace-invitation/domain/dto/global-workspace-invitations-query-options.dto.ts'
import { GetWorkspaceInvitationsByUserDTO } from '../dto/get-workspace-invitations-by-user.dto.ts'
import { WorkspaceInvitationListPolicy } from '../../domain/policies/workspace-invitation-list.policy.ts'

type GetWorkspaceInvitationsByUserUsecaseDeps = {
    userRepository: IUserRepository
    workspaceInvitationsWithWorkspaceQuery: IWorkspaceInvitationsWithWorkspaceQuery
}
        
export class GetWorkspaceInvitationsByUserUsecase {
    constructor(private readonly deps: GetWorkspaceInvitationsByUserUsecaseDeps) {}

    async execute(dto: GetWorkspaceInvitationsByUserDTO) {
        const { userRepository, workspaceInvitationsWithWorkspaceQuery } = this.deps
        const { userId, queryOptions, authContext } = dto

        const user = await userRepository.findById(userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        WorkspaceInvitationListPolicy.enforceViewUserWorkspaceInvitations(authContext, userId)

        const queryOptionsWithUserEmail: GlobalWorkspaceInvitationsQueryOptionsDTO = {
            ...queryOptions,
            filters: {
                ...queryOptions.filters,
                email: user.email.current,
                workspaceStatus: [WorkspaceStatus.ACTIVE],
            }
        }

        const workspaceInvitations = await workspaceInvitationsWithWorkspaceQuery.getWorkspaceInvitationsWithWorkspace(queryOptionsWithUserEmail)

        return workspaceInvitations
    }
}