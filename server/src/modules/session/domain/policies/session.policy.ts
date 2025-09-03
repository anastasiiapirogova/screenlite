import { AuthContext } from '@/core/types/auth-context.type.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class SessionPolicy {
    constructor(
        private readonly session: Session,
        private readonly authContext: AuthContext
    ) {}

    private isSelf(): boolean {
        if(this.authContext.isUserContext()) {
            const user = this.authContext.user

            return user.id === this.session.userId
        }

        return false
    }

    canViewSession(): boolean {
        return this.isSelf()
    }

    enforceViewSession(): void {
        if(!this.canViewSession()) {
            throw new ForbiddenError({
                details: {
                    sessionId: ['YOU_ARE_NOT_AUTHORIZED_TO_VIEW_THIS_SESSION'],
                }
            })
        }
    }
}