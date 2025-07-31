import { IPasswordResetTokenFactory } from '@/core/ports/password-reset-token-factory.interface.ts'
import { PasswordResetToken } from '@/core/entities/password-reset-token.entity.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { v4 as uuidv4 } from 'uuid'

export class PasswordResetTokenFactory implements IPasswordResetTokenFactory {
    constructor(
        private readonly tokenGenerator: ITokenGenerator,
        private readonly hasher: IHasher
    ) {}

    async create(params: {
        userId: string
        expiresAt: Date
    }): Promise<{ passwordResetToken: PasswordResetToken, rawToken: string }> {
        const token = this.tokenGenerator.generate()
        const hashToken = await this.hasher.hash(token)

        const passwordResetToken = new PasswordResetToken({
            id: uuidv4(),
            tokenHash: hashToken,
            userId: params.userId,
            expiresAt: params.expiresAt,
            createdAt: new Date(),
        })

        return {
            passwordResetToken,
            rawToken: token
        }
    }
}