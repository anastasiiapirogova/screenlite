import { ValidationError } from '@/core/errors/validation.error.ts'
import { NotFoundError } from '@/core/errors/not-found.error.ts'
import { IEmailVerificationTokenRepository } from '@/core/ports/email-verification-token-repository.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'

export type ConfirmEmailUseCaseDeps = {
    tokenRepo: IEmailVerificationTokenRepository
    userRepo: IUserRepository
    hasher: IHasher
    unitOfWork: IUnitOfWork
}

export class ConfirmEmailUseCase {
    constructor(
        private readonly deps: ConfirmEmailUseCaseDeps
    ) {}
  
    async execute(token: string) {
        const { tokenRepo, userRepo, hasher, unitOfWork } = this.deps

        const hashed = await hasher.hash(token)
        const tokenEntity = await tokenRepo.findByTokenHash(hashed)

        if (!tokenEntity || !tokenEntity.isValidVerifyToken()) {
            throw new ValidationError({
                token: ['INVALID_OR_EXPIRED_TOKEN'],
            })
        }

        const user = await userRepo.findById(tokenEntity.userId)

        if (!user) throw new NotFoundError()
  
        user.verifyEmail()

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteAllForUser(tokenEntity.userId, EmailVerificationTokenType.VERIFY)
        })
    }
}