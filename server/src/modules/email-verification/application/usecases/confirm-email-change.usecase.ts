import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { User } from '@/core/entities/user.entity.ts'
import { EmailVerificationToken } from '@/core/entities/email-verification-token.entity.ts'

export type ConfirmEmailChangeUseCaseDeps = {
    tokenRepo: IEmailVerificationTokenRepository
    userRepo: IUserRepository
    hasher: IHasher
    unitOfWork: IUnitOfWork
}

export class ConfirmEmailChangeUseCase {
    constructor(
        private readonly deps: ConfirmEmailChangeUseCaseDeps
    ) {}

    async execute(token: string) {
        const { tokenRepo, userRepo, hasher, unitOfWork } = this.deps

        const hashed = await hasher.hash(token)
        const tokenEntity = await tokenRepo.findByTokenHash(hashed)

        if (!tokenEntity || !tokenEntity.isValidEmailChangeToken()) {
            throw new ValidationError({
                token: ['INVALID_OR_EXPIRED_TOKEN'],
            })
        }

        const user = await userRepo.findById(tokenEntity.userId)

        if (!user) {
            throw new NotFoundError()
        }

        const pendingEmail = user.email.pending

        if (!pendingEmail) {
            throw new ValidationError({
                email: ['NO_PENDING_EMAIL_FOUND'],
            })
        }

        if (pendingEmail !== tokenEntity.newEmail) {
            throw new ValidationError({
                email: ['PENDING_EMAIL_DOES_NOT_MATCH_TOKEN_EMAIL'],
            })
        }

        const existingUser = await userRepo.findByEmail(tokenEntity.newEmail)

        if (existingUser) {
            await this.handleEmailConflict(user, tokenEntity, unitOfWork)

            throw new ValidationError({
                email: ['EMAIL_ALREADY_IN_USE'],
            })
        }

        user.email.confirmPending()

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteAllByUserId(tokenEntity.userId)
        })
    }

    private async handleEmailConflict(user: User, tokenEntity: EmailVerificationToken, unitOfWork: IUnitOfWork) {
        user.email.clearPending()

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteAllByUserId(tokenEntity.userId)
        })
    }
}