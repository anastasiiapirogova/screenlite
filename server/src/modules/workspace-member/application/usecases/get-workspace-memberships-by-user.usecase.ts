import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { WorkspaceMemberListPolicy } from '../../domain/policies/workspace-member-list.policy.ts'
import { GetWorkspaceMembershipsByUserDTO } from '../dto/get-workspace-memberships-by-user.dto.ts'

type GetWorkspaceMembershipsByUserUsecaseDeps = {
    userRepository: IUserRepository
    workspaceMemberRepository: IWorkspaceMemberRepository
}

export class GetWorkspaceMembershipsByUserUsecase {
    constructor(private readonly deps: GetWorkspaceMembershipsByUserUsecaseDeps) {}

    async execute(dto: GetWorkspaceMembershipsByUserDTO) {
        const { userRepository, workspaceMemberRepository } = this.deps
        const { userId, authContext, queryOptions } = dto

        const user = await userRepository.findById(userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        WorkspaceMemberListPolicy.enforceViewWorkspaceMembersByUser(authContext, userId)

        const memberships = await workspaceMemberRepository.findWithWorkspaceByUserId(userId, queryOptions)

        return memberships
    }
}