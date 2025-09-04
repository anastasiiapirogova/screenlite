import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { CompleteTotpSetupDTO } from '../dto/complete-totp-setup.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'
import { VerifyTotpCodeUsecase } from './verify-totp-code.usecase.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { TwoFactorAuthPolicy } from '../../domain/policies/two-factor-auth.policy.ts'
import { ITwoFactorMethodInvariantsService } from '../../domain/ports/two-factor-method-invariants-service.interface.ts'

type CompleteTotpSetupUsecaseDeps = {
    userRepo: IUserRepository
    twoFactorMethodRepo: ITwoFactorMethodRepository
    verifyTotpCodeUsecase: VerifyTotpCodeUsecase
    twoFactorMethodInvariantsService: ITwoFactorMethodInvariantsService
}

export class CompleteTotpSetupUsecase {
    constructor(private readonly deps: CompleteTotpSetupUsecaseDeps) {}

    async execute(authContext: AuthContext, data: CompleteTotpSetupDTO) {
        const { userRepo, twoFactorMethodInvariantsService, twoFactorMethodRepo, verifyTotpCodeUsecase } = this.deps
        const { userId, totpCode } = data

        const user = await userRepo.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND'],
            })
        }

        TwoFactorAuthPolicy.enforceCompleteTotpSetup(userId, authContext)

        await twoFactorMethodInvariantsService.enforceTotpMethodIsNotEnabled(userId)

        const method = await verifyTotpCodeUsecase.execute({
            userId,
            totpCode
        })

        method.enable()

        await twoFactorMethodRepo.save(method)

        return method
    }
}