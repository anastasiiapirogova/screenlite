import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { UserWorkspacesQueryOptionsDTO } from '../../domain/dto/user-workspaces-query-options.dto.ts'

type GetUserWorkspacesUsecaseDeps = {
    userRepository: IUserRepository
    workspaceMemberRepository: IWorkspaceMemberRepository
}

export class GetUserWorkspacesUsecase {
    constructor(private readonly deps: GetUserWorkspacesUsecaseDeps) {}

    async execute(dto: {
        userId: string
        authContext: AuthContext
        queryOptions: UserWorkspacesQueryOptionsDTO
    }) {
        const { userRepository, workspaceMemberRepository } = this.deps

        const user = await userRepository.findById(dto.userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        UserPolicy.enforceCanViewWorkspaces(dto.userId, dto.authContext)

        const workspaces = await workspaceMemberRepository.findWithWorkspaceByUserId(dto.userId, dto.queryOptions)

        return workspaces
    }
}