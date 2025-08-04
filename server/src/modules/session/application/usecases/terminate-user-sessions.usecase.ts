import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'

export class TerminateUserSessionsUseCase {
    constructor(private readonly sessionRepository: ISessionRepository) {}

    async execute(userId: string, reason: SessionTerminationReason, exceptIds: string[] = []) {
        await this.sessionRepository.terminateByUserId(userId, reason, exceptIds)
    }
}