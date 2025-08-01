import { IHasher } from '@/core/ports/hasher.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'

export type ValidateSessionUseCaseDeps = {
    sessionRepo: ISessionRepository
    userRepo: IUserRepository
    hasher: IHasher
}

export class ValidateSessionUseCase {
    constructor(
        private readonly deps: ValidateSessionUseCaseDeps
    ) {}

    async execute(sessionToken: string) {
        const { sessionRepo, userRepo, hasher } = this.deps

        const tokenHash = await hasher.hash(sessionToken)
        const session = await sessionRepo.findActiveByTokenHash(tokenHash)

        if (!session || !session.isActive) {
            throw new Error('Invalid session')
        }

        const user = await userRepo.findById(session.userId)

        if (!user || user.isDeleted) {
            throw new Error('User not found')
        }

        return {
            user,
            session,
        }
    }
}