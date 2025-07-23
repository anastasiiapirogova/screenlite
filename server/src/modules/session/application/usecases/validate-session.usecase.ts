import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'

export class ValidateSessionUseCase {
    constructor(
        private readonly sessionRepo: ISessionRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    async execute(sessionToken: string) {
        const session = await this.sessionRepo.findByToken(sessionToken)

        if (!session || !session.isActive()) {
            throw new Error('Invalid session')
        }

        const user = await this.userRepo.findById(session.userId)

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }
}