import { Session } from '@/core/entities/session.entity.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByToken(token: string): Promise<Session | null>
    findActiveByToken(token: string): Promise<Session | null>
    save(session: Session): Promise<void>
    
    terminateAll(userId: string): Promise<void>
    terminateAllExcept(userId: string, exceptToken?: string): Promise<void>
    updateActivity(sessionId: string): Promise<void>
    verifyTwoFactor(sessionId: string): Promise<void>
}