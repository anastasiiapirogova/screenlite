import { AuthContext } from '@/core/types/auth-context.type.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'

type DisableTotpMethodUsecaseDeps = {
    userRepo: IUserRepository
    twoFactorMethodRepo: ITwoFactorMethodRepository
}

// TASK: Maybe we should also require a totp code or some other form of authentication
// to be passed in to disable the method
export class DisableTotpMethodUsecase {
    constructor(private readonly deps: DisableTotpMethodUsecaseDeps) {}

    async execute(authContext: AuthContext, userId: string) {
        const { twoFactorMethodRepo } = this.deps

        const user = await this.deps.userRepo.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND'],
            })
        }

        TwoFactorAuthPolicy.enforceDisableTotpMethod(userId, authContext)

        const method = await twoFactorMethodRepo.findByUserIdAndType(userId, TwoFactorMethodType.TOTP)

        if (!method) {
            throw new ValidationError({
                userId: ['TOTP_METHOD_NOT_FOUND'],
            })
        }

        await twoFactorMethodRepo.delete(method.id)
    }
}