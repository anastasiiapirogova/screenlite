import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { IAuthStrategy } from '@/modules/auth/domain/ports/auth-strategy.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ValidateSessionUseCase } from '@/modules/session/application/usecases/validate-session.usecase.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { CheckUserTwoFactorAuthStatusUsecase } from '@/modules/two-factor-auth/application/usecases/check-user-two-factor-auth-status.usecase.ts'
import { AuthSessionFactory } from '@/core/factories/auth-session.factory.ts'
import { AuthUserFactory } from '@/core/factories/auth-user.factory.ts'

export type SessionAuthDeps = {
    sessionRepo: ISessionRepository
    userRepo: IUserRepository
    twoFactorMethodRepo: ITwoFactorMethodRepository
    hasher: IHasher
}

export class SessionAuthStrategy implements IAuthStrategy {
    private readonly sessionRepo: ISessionRepository
    private readonly userRepo: IUserRepository
    private readonly twoFactorMethodRepo: ITwoFactorMethodRepository
    private readonly hasher: IHasher

    constructor(deps: SessionAuthDeps) {
        this.sessionRepo = deps.sessionRepo
        this.userRepo = deps.userRepo
        this.twoFactorMethodRepo = deps.twoFactorMethodRepo
        this.hasher = deps.hasher
    }

    supports(tokenType: string): boolean {
        return tokenType === AuthContextType.UserSession
    }

    async authenticate(token: string): Promise<AuthContext | null> {
        const validateSession = new ValidateSessionUseCase({
            sessionRepo: this.sessionRepo,
            userRepo: this.userRepo,
            hasher: this.hasher,
        })

        const checkUserTwoFactorAuthStatus = new CheckUserTwoFactorAuthStatusUsecase(this.twoFactorMethodRepo)

        try {
            const { user, session } = await validateSession.execute(token)

            const authUser = AuthUserFactory.fromUser(user)

            const isTwoFactorAuthEnabled = await checkUserTwoFactorAuthStatus.execute(user.id)

            const authSession = AuthSessionFactory.fromSession(session, isTwoFactorAuthEnabled)

            return new UserSessionAuthContext(authUser, authSession)
        } catch {
            return null
        }
    }
}