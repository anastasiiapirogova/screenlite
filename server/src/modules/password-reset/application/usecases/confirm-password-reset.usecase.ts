import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { ConfirmPasswordResetDTO } from '../dto/confirm-password-reset.dto.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { Password } from '@/core/value-objects/password.value-object.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { UserPassword } from '@/core/entities/user-password.entity.ts'
import { UserCredentialType } from '@/core/enums/user-credential-type.enum.ts'

export type ConfirmPasswordResetUsecaseDeps = {
    unitOfWork: IUnitOfWork
    userRepo: IUserRepository
    passwordResetTokenRepo: IPasswordResetTokenRepository
    hasher: IHasher
    passwordHasher: IHasher
    userCredentialRepo: IUserCredentialRepository
}

export class ConfirmPasswordResetUsecase {
    constructor(private readonly deps: ConfirmPasswordResetUsecaseDeps) {}

    async execute(data: ConfirmPasswordResetDTO): Promise<void> {
        const { unitOfWork, userRepo, passwordResetTokenRepo, hasher, passwordHasher, userCredentialRepo } = this.deps

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

        const userPassword = new Password(password)

        const userCredentials = await userCredentialRepo.findByUserId(user.id)

        const passwordCredential = userCredentials.find(credential => credential.type === UserCredentialType.PASSWORD) as UserPassword

        if (!passwordCredential) {
            throw new ValidationError({ password: ['PASSWORD_CREDENTIAL_NOT_FOUND'] })
        }

        await passwordCredential.update(userPassword.toString(), passwordHasher)

        await unitOfWork.execute(async (repos) => {
            if (!user.email.isVerified) {
                user.email.verify()
                await repos.emailVerificationTokenRepository.deleteAllByUserId(user.id, EmailVerificationTokenType.VERIFY)
            }

            await repos.userCredentialRepository.save(passwordCredential)

            await repos.sessionRepository.terminateByUserId(user.id, SessionTerminationReason.PASSWORD_RESET)

            await repos.passwordResetTokenRepository.deleteAllByUserId(user.id)
        })
    }
}