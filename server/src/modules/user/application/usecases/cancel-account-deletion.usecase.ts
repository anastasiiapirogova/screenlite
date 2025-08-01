import { ValidationError } from '@/core/errors/validation.error.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { CancelAccountDeletionDTO } from '../dto/cancel-account-deletion.dto.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'

export class CancelAccountDeletionUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(dto: CancelAccountDeletionDTO): Promise<void> {
        const { userId } = dto

        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ValidationError({
                userId: ['USER_NOT_FOUND']
            })
        }

        const userPolicy = new UserPolicy(user, dto.authContext)

        userPolicy.enforceCanRequestDeleteAccount()

        if (!user.isDeletionRequested) {
            throw new ValidationError({
                userId: ['USER_HAS_NOT_REQUESTED_DELETION']
            })
        }
        
        user.cancelDeletionRequest()

        await this.userRepository.save(user)
    }
} 