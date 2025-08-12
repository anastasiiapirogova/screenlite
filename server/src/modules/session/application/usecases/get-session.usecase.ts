import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { ISessionRepository } from '../../domain/ports/session-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { SessionPolicy } from '../../domain/policies/session.policy.ts'

export class GetSessionUsecase {
    constructor(private readonly sessionRepository: ISessionRepository) {}

    async execute(authContext: AuthContext, sessionId: string) {
        const session = await this.sessionRepository.findById(sessionId)

        if (!session) {
            throw new NotFoundError('SESSION_NOT_FOUND')
        }

        const sessionPolicy = new SessionPolicy(session, authContext)

        sessionPolicy.enforceCanViewSession()

        return session
    }
}