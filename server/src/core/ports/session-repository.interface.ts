import { Session } from '@/core/entities/session.entity.ts'
import { SessionTerminationReason } from '../enums/session-termination-reason.enum.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByTokenHash(tokenHash: string): Promise<Session | null>
    findActiveByTokenHash(tokenHash: string): Promise<Session | null>
    save(session: Session): Promise<void>
    
    terminateAll(userId: string, terminationReason: SessionTerminationReason, exceptTokenHash?: string): Promise<void>
    updateActivity(sessionId: string): Promise<void>
}