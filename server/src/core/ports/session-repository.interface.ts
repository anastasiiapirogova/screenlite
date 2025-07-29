import { Session } from '@/core/entities/session.entity.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByTokenHash(tokenHash: string): Promise<Session | null>
    findActiveByTokenHash(tokenHash: string): Promise<Session | null>
    save(session: Session): Promise<void>
    
    terminateAll(userId: string): Promise<void>
    terminateAllExcept(userId: string, exceptTokenHash?: string): Promise<void>
    updateActivity(sessionId: string): Promise<void>
    verifyTwoFactor(sessionId: string): Promise<void>
}