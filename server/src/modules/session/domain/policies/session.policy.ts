import { AuthContext } from '@/core/types/auth-context.type.ts'
import { Session } from '@/core/entities/session.entity.ts'

export class SessionPolicy {
    constructor(
        private readonly session: Session,
        private readonly authContext: AuthContext
    ) {}

    private isOwnSession(): boolean {
        if(this.authContext.isUserContext()) {
            const user = this.authContext.user

            return user.id === this.session.userId
        }

        return false
    }
}