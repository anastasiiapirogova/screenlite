import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { LogoutDTO } from '../dto/logout.dto.ts'

export class LogoutUsecase {
    constructor(
        private readonly sessionRepository: ISessionRepository,
    ) {}

    async execute(data: LogoutDTO): Promise<void> {
        const session = await this.sessionRepository.findActiveByToken(data.sessionToken)

        if (!session) {
            throw new ValidationError({ sessionToken: ['SESSION_NOT_FOUND'] })
        }

        if (!session.isActive()) {
            throw new ValidationError({ sessionToken: ['SESSION_NOT_ACTIVE'] })
        }

        session.terminate('manual_logout')

        await this.sessionRepository.save(session)
    }
}