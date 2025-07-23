import { ValidationError } from '@/core/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { RequestAccountDeletionDTO } from '../dto/request-account-deletion.dto.ts'
import { AuthorizationError } from '@/core/errors/authorization.error.ts'

export class RequestAccountDeletionUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(dto: RequestAccountDeletionDTO): Promise<void> {
        const { userId, requester, currentSessionToken } = dto

        if (userId !== requester.id) {
            throw new AuthorizationError({
                userId: ['NOT_AUTHORIZED_TO_REQUEST_THIS_ACCOUNT_DELETION']
            })
        }

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

            if (currentSessionToken) {
                await repos.sessionRepository.terminateAllExcept(userId, currentSessionToken)
            } else {
                await repos.sessionRepository.terminateAll(userId)
            }
        })
    }
}