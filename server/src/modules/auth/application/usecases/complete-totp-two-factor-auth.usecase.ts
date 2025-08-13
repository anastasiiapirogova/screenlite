import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { VerifyTotpCodeUsecase } from '@/modules/two-factor-auth/application/usecases/verify-totp-code.usecase.ts'

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

        const session = authContext.session

        session.authenticateTwoFactor()

        await sessionRepo.save(session)
    }
}