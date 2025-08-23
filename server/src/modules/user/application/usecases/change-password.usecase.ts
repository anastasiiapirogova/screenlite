import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { UserPolicy } from '../../domain/policies/user.policy.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { SessionTerminationReason } from '@/core/enums/session-termination-reason.enum.ts'
import { ChangePasswordDTO } from '../dto/change-password.dto.ts'
import { ValidationError } from '@/shared/errors/validation.error.ts'
import { Password } from '@/core/value-objects/password.value-object.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { UserCredentialType } from '@/core/enums/user-credential-type.enum.ts'
import { UserPassword } from '@/core/entities/user-password.entity.ts'

type ChangePasswordUsecaseDeps = {
    unitOfWork: IUnitOfWork
    userRepository: IUserRepository
    passwordHasher: IHasher
    userCredentialRepository: IUserCredentialRepository
}

export class ChangePasswordUseCase {
    constructor(
        private readonly deps: ChangePasswordUsecaseDeps,
    ) {}

    async execute(data: ChangePasswordDTO) {
        const { authContext, userId, password, currentPassword } = data

        const { unitOfWork, userRepository, passwordHasher, userCredentialRepository } = this.deps

        const user = await userRepository.findById(userId)

        if(!user) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const currentSessionId = authContext.session?.id

        const userPolicy = new UserPolicy(user, authContext)

        userPolicy.enforceCanChangePassword()

        const userCredentials = await userCredentialRepository.findByUserId(user.id)

        const passwordCredential = userCredentials.find(credential => credential.type === UserCredentialType.PASSWORD) as UserPassword

        const isCurrentPasswordValid = await passwordCredential.validate(currentPassword, passwordHasher)

        if(!isCurrentPasswordValid) {
            throw new ValidationError({
                currentPassword: ['CURRENT_PASSWORD_IS_INVALID']
            })
        }

        const userPassword = new Password(password)

        await passwordCredential.update(userPassword.toString(), passwordHasher)

        await unitOfWork.execute(async (repos) => {
            await repos.userCredentialRepository.save(passwordCredential)

            await repos.sessionRepository.terminateByUserId(user.id, SessionTerminationReason.PASSWORD_CHANGED, currentSessionId ? [currentSessionId] : [])
        })

        return user
    }
}