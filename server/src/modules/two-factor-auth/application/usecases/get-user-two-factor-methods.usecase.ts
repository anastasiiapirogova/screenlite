import { AuthContext } from '@/core/types/auth-context.type.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { TwoFactorMethodMapper } from '../../infrastructure/mappers/two-factor-method-mapper.ts'

export class GetUserTwoFactorMethodsUsecase {
    constructor(
        private readonly twoFactorMethodRepo: ITwoFactorMethodRepository,
        private readonly userRepo: IUserRepository
    ) {}

    async execute(userId: string, authContext: AuthContext) {
        const user = await this.userRepo.findById(userId)

        const mapper = new TwoFactorMethodMapper()

        if(!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        TwoFactorAuthPolicy.enforceViewTwoFactorMethods(userId, authContext)

        const methods = await this.twoFactorMethodRepo.findByUserId(userId)

        return methods.map(mapper.toPublicDTO)
    }
}