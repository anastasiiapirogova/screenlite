import { Session } from '@/core/entities/session.entity.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ISessionFactory } from '@/core/ports/session-factory.interface.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { v4 as uuid } from 'uuid'

export class SessionFactory implements ISessionFactory {
    constructor(
        private readonly tokenGenerator: ITokenGenerator,
        private readonly hasher: IHasher
    ) {}

    async create(params: {
        userId: string
        userAgent: string
        ipAddress: string
        location?: string | null
    }): Promise<{ session: Session, token: string }> {
        const token = this.tokenGenerator.generate()
        const hashToken = await this.hasher.hash(token)

        const session = new Session({
            id: uuid(),
            userId: params.userId,
            tokenHash: hashToken,
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            location: params.location ?? null,
            terminatedAt: null,
            lastActivityAt: new Date(),
            twoFaVerifiedAt: null,
            terminationReason: null,
        })

        return {
            session,
            token
        }
    }
}