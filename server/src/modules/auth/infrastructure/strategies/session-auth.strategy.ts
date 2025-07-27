import { IAuthContext } from '@/core/ports/auth-context.interface.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { IAuthStrategy } from '@/core/ports/auth-strategy.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ValidateSessionUseCase } from '@/modules/session/application/usecases/validate-session.usecase.ts'

export type SessionAuthDeps = {
    sessionRepo: ISessionRepository
    userRepo: IUserRepository
    hasher: IHasher
}

export class SessionAuthStrategy implements IAuthStrategy {
    private readonly sessionRepo: ISessionRepository
    private readonly userRepo: IUserRepository
    private readonly hasher: IHasher

    constructor(deps: SessionAuthDeps) {
        this.sessionRepo = deps.sessionRepo
        this.userRepo = deps.userRepo
        this.hasher = deps.hasher
    }

    supports(tokenType: string): boolean {
        return tokenType === AuthContextType.UserSession
    }

    async authenticate(token: string): Promise<IAuthContext | null> {
        const validateSession = new ValidateSessionUseCase({
            sessionRepo: this.sessionRepo,
            userRepo: this.userRepo,
            hasher: this.hasher,
        })

        try {
            const { user, session } = await validateSession.execute(token)

            return {
                type: AuthContextType.UserSession,
                user,
                session,
                adminPermissions: null
            }
        } catch {
            return null
        }
    }
}