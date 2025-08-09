import { ITwoFactorMethodRepository } from '../../domain/ports/two-factor-method-repository.interface.ts'

export class CheckUserTwoFactorAuthStatusUsecase {
    constructor(
        private readonly twoFactorMethodRepo: ITwoFactorMethodRepository
    ) {}

    async execute(userId: string) {
        const count = await this.twoFactorMethodRepo.countByUserId(userId, true)

        return count > 0
    }
}