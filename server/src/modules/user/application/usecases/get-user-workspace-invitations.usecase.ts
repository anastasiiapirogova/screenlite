import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { IWorkspaceInvitationsWithWorkspaceQuery } from '@/modules/workspace-invitation/domain/ports/workspace-invitations-with-workspace-query.interface.ts'
import { GetUserWorkspaceInvitationsDTO } from '../dto/get-user-workspace-invitations.dto.ts'
import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '@/modules/workspace-invitation/domain/dto/global-workspace-invitations-query-options.dto.ts'

type GetUserWorkspaceInvitationsUsecaseDeps = {
    userRepository: IUserRepository
    workspaceInvitationsWithWorkspaceQuery: IWorkspaceInvitationsWithWorkspaceQuery
}

export class GetUserWorkspaceInvitationsUsecase {
    constructor(private readonly deps: GetUserWorkspaceInvitationsUsecaseDeps) {}

    async execute(dto: GetUserWorkspaceInvitationsDTO) {
        const { userRepository, workspaceInvitationsWithWorkspaceQuery } = this.deps
        const { userId, queryOptions, authContext } = dto

        const user = await userRepository.findById(userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        UserPolicy.enforceViewWorkspaceInvitationsList(userId, authContext)

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