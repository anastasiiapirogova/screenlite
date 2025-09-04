import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { IUserAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/user-admin-permission-repository.interface.ts'
import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { IInitiatorRepository } from '@/modules/initiator/domain/ports/initiator-repository.interface.ts'
import { IInitiatorService } from '@/modules/initiator/domain/ports/initiator-service.interface.ts'
import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { ISessionTokenService } from '@/modules/session/domain/ports/session-token-service.interface.ts'
import { ISettingRepository } from '@/modules/setting/domain/setting-repository.interface.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { TwoFactorConfigHandlerFactory } from '@/modules/two-factor-auth/infrastructure/handlers/two-factor-config-handler.factory.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IWorkspaceInvitationRepository } from '@/modules/workspace-invitation/domain/ports/workspace-invitation-repository.interface.ts'
import { IWorkspaceInvitationService } from '@/modules/workspace-invitation/domain/ports/workspace-invitation-service.interface.ts'
import { IWorkspaceInvitationsWithWorkspaceQuery } from '@/modules/workspace-invitation/domain/ports/workspace-invitations-with-workspace-query.interface.ts'
import { IWorkspaceInvitationServiceFactory } from '@/modules/workspace-invitation/domain/services/workspace-invitation-service.factory.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { IWorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'
import { IWorkspaceAccessService } from '@/modules/workspace/domain/ports/workspace-access-service.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IWorkspaceStatisticsQuery } from '@/modules/workspace/domain/ports/workspace-statistics-query.interface.ts'
import { IWorkspacesQuery } from '@/modules/workspace/domain/ports/workspaces-query.interface.ts'
import { IWorkspaceInvariantsService } from '@/modules/workspace/domain/ports/workspace-invariants-service.interface.ts'
import { ITwoFactorMethodInvariantsService } from '@/modules/two-factor-auth/domain/ports/two-factor-method-invariants-service.interface.ts'

declare module 'fastify' {
    interface FastifyInstance {
        userRepository: IUserRepository
        userCredentialRepository: IUserCredentialRepository
        secureHasher: IHasher
        unitOfWork: IUnitOfWork
        imageValidator: IImageValidator
        imageProcessor: IImageProcessor
        adminPermissionRepository: IUserAdminPermissionRepository
        twoFactorConfigHandlerFactory: TwoFactorConfigHandlerFactory
        twoFactorMethodRepository: ITwoFactorMethodRepository
        sessionRepository: ISessionRepository
        sessionTokenService: ISessionTokenService
        emailVerificationTokenRepository: IEmailVerificationTokenRepository
        tokenGenerator: ITokenGenerator
        passwordResetTokenRepository: IPasswordResetTokenRepository
        settingRepository: ISettingRepository
        workspaceRepository: IWorkspaceRepository
        workspaceMemberRepository: IWorkspaceMemberRepository
        workspaceMemberService: IWorkspaceMemberService
        workspaceMemberServiceFactory: IWorkspaceMemberServiceFactory
        workspaceAccessService: IWorkspaceAccessService
        workspaceStatisticsQuery: IWorkspaceStatisticsQuery
        workspaceInvitationRepository: IWorkspaceInvitationRepository
        workspaceInvitationServiceFactory: IWorkspaceInvitationServiceFactory
        workspaceInvitationService: IWorkspaceInvitationService
        workspaceInvitationsWithWorkspaceQuery: IWorkspaceInvitationsWithWorkspaceQuery
        initiatorRepository: IInitiatorRepository
        initiatorService: IInitiatorService
        workspacesQuery: IWorkspacesQuery
        workspaceInvariantsService: IWorkspaceInvariantsService
        twoFactorMethodInvariantsService: ITwoFactorMethodInvariantsService
    }
}