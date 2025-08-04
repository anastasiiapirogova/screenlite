import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { PasswordResetToken } from '@/core/entities/password-reset-token.entity.ts'

export type GetActivePasswordResetTokenUsecaseDeps = {
    passwordResetTokenRepo: IPasswordResetTokenRepository
    hasher: IHasher
}

export class GetActivePasswordResetTokenUsecase {
    constructor(private readonly deps: GetActivePasswordResetTokenUsecaseDeps) {}

    async execute(token: string): Promise<PasswordResetToken | null> {
        const { passwordResetTokenRepo, hasher } = this.deps

        const tokenHash = await hasher.hash(token)

        const passwordResetToken = await passwordResetTokenRepo.findByTokenHash(tokenHash)

        if (!passwordResetToken || !passwordResetToken.isValid()) {
            return null
        }

        return passwordResetToken
    }
}