import { Session } from '@/core/entities/session.entity.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { SessionsQueryOptionsDTO } from '../dto/sessions-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'

export interface ISessionRepository {
    findById(id: string): Promise<Session | null>
    findByTokenHash(tokenHash: string): Promise<Session | null>
    findActiveByTokenHash(tokenHash: string): Promise<Session | null>
    save(session: Session): Promise<void>
    terminateByUserId(userId: string, terminationReason: SessionTerminationReason, exceptIds?: string[]): Promise<void>
    updateActivity(sessionId: string): Promise<void>
    findAll(options?: SessionsQueryOptionsDTO): Promise<PaginationResponse<Session>>
}