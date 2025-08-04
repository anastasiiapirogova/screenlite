import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { LogoutDTO } from '../dto/logout.dto.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'

export type LogoutUsecaseDeps = {
    sessionRepository: ISessionRepository
}

export class LogoutUsecase {
    constructor(
        private readonly deps: LogoutUsecaseDeps
    ) {}

    async execute(data: LogoutDTO): Promise<void> {
        const { sessionRepository } = this.deps

        const session = await sessionRepository.findActiveByTokenHash(data.sessionTokenHash)

        if (!session) {
            throw new ValidationError({ sessionToken: ['SESSION_NOT_FOUND'] })
        }

        if (!session.isActive) {
            throw new ValidationError({ sessionToken: ['SESSION_NOT_ACTIVE'] })
        }

        session.terminate(SessionTerminationReason.LOGGED_OUT)

        await sessionRepository.save(session)
    }
}