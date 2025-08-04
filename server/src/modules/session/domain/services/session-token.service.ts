import { Session } from '@/core/entities/session.entity.ts'
import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { ISessionTokenService } from '../ports/session-token-service.interface.ts'

export class SessionTokenService implements ISessionTokenService {
    constructor(
        private readonly tokenGenerator: ITokenGenerator,
        private readonly hasher: IHasher
    ) {}

    generateToken(): string {
        return this.tokenGenerator.generate()
    }

    async hashToken(token: string): Promise<string> {
        return await this.hasher.hash(token)
    }

    formatToken(token: string): string {
        return `${AuthContextType.UserSession}:${token}`
    }

    async rotateToken(session: Session): Promise<{ session: Session, token: string }> {
        const token = this.generateToken()
        const hash = await this.hashToken(token)

        session.updateTokenHash(hash)

        return {
            session,
            token: this.formatToken(token),
        }
    }
}
