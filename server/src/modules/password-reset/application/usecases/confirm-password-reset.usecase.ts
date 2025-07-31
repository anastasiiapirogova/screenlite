import { IPasswordResetTokenRepository } from '@/core/ports/password-reset-token-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { ValidationError } from '@/core/errors/validation.error.ts'
import { ConfirmPasswordResetDTO } from '../dto/confirm-password-reset.dto.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'

export type ConfirmPasswordResetUsecaseDeps = {
    unitOfWork: IUnitOfWork
    userRepo: IUserRepository
    passwordResetTokenRepo: IPasswordResetTokenRepository
    hasher: IHasher
    passwordHasher: IHasher
}

export class ConfirmPasswordResetUsecase {
    constructor(private readonly deps: ConfirmPasswordResetUsecaseDeps) {}

    async execute(data: ConfirmPasswordResetDTO): Promise<void> {
        const { unitOfWork, userRepo, passwordResetTokenRepo, hasher, passwordHasher } = this.deps

        const { token, password } = data

        const tokenHash = await hasher.hash(token)

        const passwordResetToken = await passwordResetTokenRepo.findByTokenHash(tokenHash)

        if (!passwordResetToken || !passwordResetToken.isValid()) {
            throw new ValidationError({
                token: ['INVALID_TOKEN'],
            })
        }

        const user = await userRepo.findById(passwordResetToken.userId)

        if (!user) {
            throw new ValidationError({
                token: ['USER_NOT_FOUND'],
            })
        }

        const hashedPassword = await passwordHasher.hash(password)

        user.updatePassword(hashedPassword)

        await unitOfWork.execute(async (repos) => {
            if (!user.isEmailVerified) {
                user.verifyEmail()
                await repos.emailVerificationTokenRepository.deleteAllByUserId(user.id, EmailVerificationTokenType.VERIFY)
            }

            await repos.userRepository.save(user)

            await repos.sessionRepository.terminateByUserId(user.id, SessionTerminationReason.PASSWORD_RESET)

            await repos.passwordResetTokenRepository.deleteAllByUserId(user.id)
        })
    }
}