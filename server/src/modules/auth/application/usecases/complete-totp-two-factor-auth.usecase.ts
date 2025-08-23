import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { VerifyTotpCodeUsecase } from '@/modules/two-factor-auth/application/usecases/verify-totp-code.usecase.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'

type CompleteTotpTwoFactorAuthUsecaseDeps = {
    verifyTotpCodeUsecase: VerifyTotpCodeUsecase
    sessionRepo: ISessionRepository
}

export class CompleteTotpTwoFactorAuthUsecase {
    constructor(private readonly deps: CompleteTotpTwoFactorAuthUsecaseDeps) {}

    async execute(authContext: UserSessionAuthContext, totpCode: string) {
        const { verifyTotpCodeUsecase, sessionRepo } = this.deps

        await verifyTotpCodeUsecase.execute({
            userId: authContext.user.id,
            totpCode,
        })

        const session = await sessionRepo.findById(authContext.session.id)

        if(!session) {
            throw new ValidationError({ sessionId: ['SESSION_NOT_FOUND'] })
        }

        session.authenticateTwoFactor()

        await sessionRepo.save(session)
    }
}