import { IAdminPermissionRepository } from '../../modules/admin-permission/domain/ports/admin-permission-repository.interface.ts'
import { IEmailVerificationTokenRepository } from '../../modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { IPasswordResetTokenRepository } from '../../modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { ISessionRepository } from '../../modules/session/domain/ports/session-repository.interface.ts'
import { IUserAdminPermissionRepository } from '../../modules/admin-permission/domain/ports/user-admin-permission-repository.interface.ts'
import { IUserRepository } from '../../modules/user/domain/ports/user-repository.interface.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { IUserCredentialRepository } from './user-credential-repository.interface.ts'
import { IWorkspaceMemberRepository } from './workspace-member-repository.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'

export type IUnitOfWork = {
    execute<T>(fn: (repos: {
        userRepository: IUserRepository
        sessionRepository: ISessionRepository
        emailVerificationTokenRepository: IEmailVerificationTokenRepository
        userAdminPermissionRepository: IUserAdminPermissionRepository
        adminPermissionRepository: IAdminPermissionRepository
        passwordResetTokenRepository: IPasswordResetTokenRepository
        twoFactorMethodRepository: ITwoFactorMethodRepository
        userCredentialRepository: IUserCredentialRepository
        workspaceRepository: IWorkspaceRepository
        workspaceMemberRepository: IWorkspaceMemberRepository
    }) => Promise<T>): Promise<T>
}