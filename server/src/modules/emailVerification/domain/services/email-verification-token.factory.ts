import { EmailVerificationToken } from '@/core/entities/email-verification-token.entity.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IEmailVerificationTokenFactory } from '@/core/ports/email-verification-token-factory.interface.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { v4 as uuid } from 'uuid'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'

export class EmailVerificationTokenFactory implements IEmailVerificationTokenFactory {
    constructor(
        private readonly tokenGenerator: ITokenGenerator,
        private readonly hasher: IHasher,
    ) {}

    async create(params: {
        userId: string
        type: EmailVerificationTokenType
        expiresAt: Date
        newEmail?: string
    }): Promise<{ token: EmailVerificationToken, rawToken: string }> {
        const generatedToken = this.tokenGenerator.generate()
        const hashToken = await this.hasher.hash(generatedToken)

        const token = new EmailVerificationToken({
            id: uuid(),
            userId: params.userId,
            tokenHash: hashToken,
            type: params.type,
            expiresAt: params.expiresAt,
            newEmail: params.newEmail ?? null,
            createdAt: new Date(),
        })

        return {
            token,
            rawToken: generatedToken,
        }
    }
}