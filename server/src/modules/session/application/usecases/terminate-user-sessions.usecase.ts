import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class TerminateUserSessionsUseCase {
    constructor(private readonly sessionRepository: ISessionRepository) {}

    async execute(authContext: AuthContext, userId: string, reason: SessionTerminationReason, exceptIds: string[] = []) {
        let currentSessionId: string | undefined = undefined

        if(authContext.isUserContext() && (authContext as UserSessionAuthContext).user.id === userId) {
            const session = (authContext as UserSessionAuthContext).session

            currentSessionId = session.id
        }

        await this.sessionRepository.terminateByUserId(userId, reason, currentSessionId ? [currentSessionId] : exceptIds)
    }
}