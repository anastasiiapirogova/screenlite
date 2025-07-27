import { ValidationError } from '@/core/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { RequestAccountDeletionDTO } from '../dto/request-account-deletion.dto.ts'

export class RequestAccountDeletionUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(dto: RequestAccountDeletionDTO): Promise<void> {
        const { userId, currentSessionTokenHash } = dto

        // TODO: Check if the requester has the permission to request account deletion

        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND']
            })
        }

        if (user.isDeletionRequested) {
            throw new ValidationError({
                userId: ['USER_ALREADY_REQUESTED_FOR_DELETION']
            })
        }
        
        user.requestDeletion()

        await this.unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)

            if (currentSessionTokenHash) {
                await repos.sessionRepository.terminateAllExcept(userId, currentSessionTokenHash)
            } else {
                await repos.sessionRepository.terminateAll(userId)
            }
        })
    }
}