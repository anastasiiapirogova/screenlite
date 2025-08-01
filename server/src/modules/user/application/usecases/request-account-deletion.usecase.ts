import { ValidationError } from '@/core/errors/validation.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { RequestAccountDeletionDTO } from '../dto/request-account-deletion.dto.ts'
import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'

export class RequestAccountDeletionUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(dto: RequestAccountDeletionDTO): Promise<void> {
        const { userId, authContext } = dto

        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND']
            })
        }

        const userPolicy = new UserPolicy(user, authContext)

        userPolicy.enforceCanRequestDeleteAccount()

        if (user.isDeletionRequested) {
            throw new ValidationError({
                userId: ['USER_ALREADY_REQUESTED_FOR_DELETION']
            })
        }
        
        user.requestDeletion()

        await this.unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)

            let currentSessionId: string | undefined = undefined

            if(authContext.isUserContext() && (authContext as UserSessionAuthContext).user.id === userId) {
                const session = (authContext as UserSessionAuthContext).session

                currentSessionId = session.id
            }

            await repos.sessionRepository.terminateByUserId(userId, SessionTerminationReason.REQUESTED_ACCOUNT_DELETION, currentSessionId ? [currentSessionId] : [])
        })
    }
}