import { Session } from '@/core/entities/session.entity.ts'
import { AuthSession } from '@/core/value-objects/auth-session.value-object.ts'

export class AuthSessionFactory {
    static fromSession(session: Session, isTwoFactorAuthEnabled: boolean): AuthSession {
        return new AuthSession({
            id: session.id,
            isTerminated: !!session.terminatedAt,
            pendingTwoFactorAuth: isTwoFactorAuthEnabled && !session.completedTwoFactorAuthAt,
        })
    }
}