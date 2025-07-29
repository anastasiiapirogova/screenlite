import { IAdminPermissionRepository } from './admin-permission-repository.interface.ts'
import { IEmailVerificationTokenRepository } from './email-verification-token-repository.interface.ts'
import { ISessionRepository } from './session-repository.interface.ts'
import { IUserAdminPermissionRepository } from './user-admin-permission-repository.interface.ts'
import { IUserRepository } from './user-repository.interface.ts'

export type IUnitOfWork = {
    execute<T>(fn: (repos: {
        userRepository: IUserRepository
        sessionRepository: ISessionRepository
        emailVerificationTokenRepository: IEmailVerificationTokenRepository
        userAdminPermissionRepository: IUserAdminPermissionRepository
        adminPermissionRepository: IAdminPermissionRepository
    }) => Promise<T>): Promise<T>
}