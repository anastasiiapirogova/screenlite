import { Session } from '@/core/entities/session.entity.ts'
import { SessionTerminationReason } from '../enums/session-termination-reason.enum.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByTokenHash(tokenHash: string): Promise<Session | null>
    findActiveByTokenHash(tokenHash: string): Promise<Session | null>
    save(session: Session): Promise<void>
    terminateByUserId(userId: string, terminationReason: SessionTerminationReason, exceptIds?: string[]): Promise<void>
    updateActivity(sessionId: string): Promise<void>
}