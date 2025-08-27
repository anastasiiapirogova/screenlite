import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'

type GetUserUsecaseDeps = {
    userRepository: IUserRepository
}

export class GetUserUsecase {
    constructor(private readonly deps: GetUserUsecaseDeps) {}

    async execute(dto: {
        userId: string
        authContext: AuthContext
    }) {
        const { userRepository } = this.deps

        const user = await userRepository.findById(dto.userId)

        if (!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const userPolicy = new UserPolicy(user, dto.authContext)

        userPolicy.enforceCanView()

        return user
    }
}