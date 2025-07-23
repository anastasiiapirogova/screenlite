import { Session } from '@/core/entities/session.entity.ts'
import { ITransactionClient } from './transaction-client.interface.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByToken(token: string): Promise<Session | null>
    findActiveByToken(token: string): Promise<Session | null>
    save(session: Session): Promise<void>
    
    terminateAll(userId: string): Promise<void>
    terminateAllExcept(userId: string, exceptToken: string): Promise<void>
    updateActivity(sessionId: string): Promise<void>
    verifyTwoFactor(sessionId: string): Promise<void>
    
    saveWithTransaction(session: Session, tx: ITransactionClient): Promise<void>
    terminateAllWithTransaction(userId: string, tx: ITransactionClient): Promise<void>
    terminateAllExceptWithTransaction(
        userId: string, 
        exceptToken: string,
        tx: ITransactionClient
    ): Promise<void>
}