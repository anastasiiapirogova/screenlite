import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { ChangePasswordDTO } from '../dto/change-password.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { UserPassword } from '@/core/value-objects/user-password.value-object.ts'

type ChangePasswordUsecaseDeps = {
    unitOfWork: IUnitOfWork
    userRepository: IUserRepository
    passwordHasher: IHasher
}

export class ChangePasswordUseCase {
    constructor(
        private readonly deps: ChangePasswordUsecaseDeps,
    ) {}

    async execute(data: ChangePasswordDTO) {
        const { authContext, userId, password, currentPassword } = data

        const { unitOfWork, userRepository, passwordHasher } = this.deps

        const user = await userRepository.findById(userId)

        if(!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const currentSessionId = authContext.session?.id

        const userPolicy = new UserPolicy(user, authContext)

        userPolicy.enforceCanChangePassword()

        const isCurrentPasswordValid = await passwordHasher.compare(currentPassword, user.passwordHash)

        if(!isCurrentPasswordValid) {
            throw new ValidationError({
                currentPassword: ['CURRENT_PASSWORD_IS_INVALID']
            })
        }

        const userPassword = new UserPassword(password)

        const passwordHash = await passwordHasher.hash(userPassword.toString())

        user.updatePassword(passwordHash)

        await unitOfWork.execute(async (repos) => {
            await repos.userRepository.save(user)

            await repos.sessionRepository.terminateByUserId(user.id, SessionTerminationReason.PASSWORD_CHANGED, currentSessionId ? [currentSessionId] : [])
        })

        return user
    }
}