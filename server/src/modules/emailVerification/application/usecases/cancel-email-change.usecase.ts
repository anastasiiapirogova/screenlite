import { NotFoundError } from '@/core/errors/not-found.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'

export type CancelEmailChangeUseCaseDeps = {
    userRepo: IUserRepository
    unitOfWork: IUnitOfWork
}

export class CancelEmailChangeUseCase {
    constructor(
        private readonly deps: CancelEmailChangeUseCaseDeps
    ) {}

    async execute(userId: string) {
        const { userRepo, unitOfWork } = this.deps

        const user = await userRepo.findById(userId)

        if (!user) {
            throw new NotFoundError()
        }

        user.clearPendingEmail()

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteAllForUser(userId, EmailVerificationTokenType.EMAIL_CHANGE)
        })
    }
}