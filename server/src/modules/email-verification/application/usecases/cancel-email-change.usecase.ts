import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
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

        user.email.clearPending()

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)
            await repos.emailVerificationTokenRepository.deleteAllByUserId(userId, EmailVerificationTokenType.EMAIL_CHANGE)
        })
    }
}