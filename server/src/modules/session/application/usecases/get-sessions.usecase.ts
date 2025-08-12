import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { SessionsQueryOptionsDTO } from '../../domain/dto/sessions-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { SessionListPolicy } from '../../domain/policies/session-list.policy.ts'

export class GetSessionsUsecase {
    constructor(
        private readonly sessionRepository: ISessionRepository
    ) {}

    async execute(authContext: AuthContext, options?: SessionsQueryOptionsDTO): Promise<PaginationResponse<Session>> {
        const sessionListPolicy = new SessionListPolicy(authContext)

        if(options?.filters?.userId) {
            sessionListPolicy.enforceCanViewSessionsForUser(options.filters.userId)
        } else {
            sessionListPolicy.enforceCanViewAllSessions()
        }

        const { items, meta } = await this.sessionRepository.findAll(options)

        return {
            items,
            meta,
        }
    }
}