import { Session } from '@/core/entities/session.entity.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'
import { ISessionTokenGenerator } from '@/core/ports/session-token-generator.interface.ts'
import { v4 as uuid } from 'uuid'

export class SessionFactory implements ISessionFactory {
    constructor(
        private readonly tokenService: ISessionTokenGenerator
    ) {}

    create(params: {
        userId: string
        userAgent: string
        ipAddress: string
        location?: string | null
    }): Session {
        return new Session({
            id: uuid(),
            userId: params.userId,
            token: this.tokenService.generate(),
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            location: params.location ?? null,
            terminatedAt: null,
            lastActivityAt: new Date(),
            twoFaVerifiedAt: null,
            terminationReason: null,
        })
    }
}