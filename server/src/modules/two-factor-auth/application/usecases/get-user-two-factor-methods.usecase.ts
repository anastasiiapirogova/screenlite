import { AuthContext } from '@/core/types/auth-context.type.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'

export class GetUserTwoFactorMethodsUsecase {
    constructor(
        private readonly twoFactorMethodRepo: ITwoFactorMethodRepository,
        private readonly userRepo: IUserRepository
    ) {}

    async execute(userId: string, authContext: AuthContext) {
        const user = await this.userRepo.findById(userId)

        if(!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const policy = new TwoFactorAuthPolicy(user, authContext)

        policy.enforceCanViewTwoFactorMethods()

        return this.twoFactorMethodRepo.findByUserId(userId)
    }
}