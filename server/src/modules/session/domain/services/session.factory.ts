import { Session } from '@/core/entities/session.entity.ts'
import { v4 as uuid } from 'uuid'

export class SessionFactory {
    create(params: {
        userId: string
        userAgent: string
        ipAddress: string
        location?: string | null
        tokenHash: string
    }): Session {
        return new Session({
            id: uuid(),
            userId: params.userId,
            tokenHash: params.tokenHash,
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            location: params.location ?? null,
            terminatedAt: null,
            lastActivityAt: new Date(),
            completedTwoFactorAuthAt: null,
            terminationReason: null,
            version: 1,
        })
    }
}
