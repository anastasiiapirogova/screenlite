import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { SharpImageValidator } from '@/shared/infrastructure/services/sharp-image-validator.service.ts'
import { SharpImageProcessor } from '@/shared/infrastructure/services/sharp-image-processor.service.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { TwoFactorConfigHandlerFactory } from '@/modules/two-factor-auth/infrastructure/handlers/two-factor-config-handler.factory.ts'
import { PrismaTwoFactorMethodRepository } from '@/modules/two-factor-auth/infrastructure/repositories/prisma-two-factor-method.repository.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { SessionTokenService } from '@/modules/session/domain/services/session-token.service.ts'
import { PrismaEmailVerificationTokenRepository } from '@/modules/email-verification/infrastructure/repositories/prisma-email-verification-token.repository.ts'
import { PrismaPasswordResetTokenRepository } from '@/modules/password-reset/infrastructure/repositories/prisma-password-reset-token.repository.ts'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { PrismaWorkspaceRepository } from '@/modules/workspace/infrastructure/repositories/prisma-workspace.repository.ts'
import { PrismaWorkspaceMemberRepository } from '@/modules/workspace-member/infrastructure/repositories/prisma-workspace-member.repository.ts'
import { WorkspaceMemberService } from '@/modules/workspace-member/domain/services/workspace-member.service.ts'
import { workspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'
import { WorkspaceAccessService } from '@/modules/workspace/domain/services/workspace-access.service.ts'    
import { PrismaWorkspaceStatisticsQuery } from '@/modules/workspace/infrastructure/queries/prisma-workspace-statistics.query.ts'
import { PrismaWorkspaceInvitationRepository } from '@/modules/workspace-invitation/infrastructure/repositories/prisma-workspace-invitation.repository.ts'
import { workspaceInvitationServiceFactory } from '@/modules/workspace-invitation/domain/services/workspace-invitation-service.factory.ts'
import { WorkspaceInvitationService } from '@/modules/workspace-invitation/domain/services/workspace-invitation.service.ts'
import { PrismaWorkspaceInvitationsWithWorkspaceQuery } from '@/modules/workspace-invitation/infrastructure/queries/workspace-invitations-with-workspace.query.ts'
import { PrismaInitiatorRepository } from '@/modules/initiator/infrastructure/repositories/prisma-initiator.repository.ts'
import { InitiatorService } from '@/modules/initiator/domain/services/initiator.service.ts'
import { PrismaWorkspacesQuery } from '@/modules/workspace/infrastructure/queries/prisma-workspaces.query.ts'
import { WorkspaceInvariantsService } from '@/modules/workspace/domain/services/workspace-invariants.service.ts'
import { TwoFactorMethodInvariantsService } from '@/modules/two-factor-auth/domain/services/two-factor-method-invariants.service.ts'
import { TotpSetupService } from '@/modules/two-factor-auth/domain/services/totp-setup.service.ts'
import { TotpService } from '@/modules/two-factor-auth/infrastructure/services/totp.service.ts'

const diPlugin: FastifyPluginAsync = async (fastify) => {
    const fastHasher = new FastHasher()
    const secureHasher = new BcryptHasher()

    const userRepository = new PrismaUserRepository(fastify.prisma)
    const userCredentialRepository = new PrismaUserCredentialRepository(fastify.prisma)
    const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
    const imageValidator = new SharpImageValidator()
    const imageProcessor = new SharpImageProcessor()
    const adminPermissionRepository = new PrismaUserAdminPermissionRepository(fastify.prisma)
    const twoFactorConfigHandlerFactory = new TwoFactorConfigHandlerFactory(fastify.prisma)
    const twoFactorMethodRepository = new PrismaTwoFactorMethodRepository(fastify.prisma, twoFactorConfigHandlerFactory)
    const sessionRepository = new PrismaSessionRepository(fastify.prisma)
    const tokenGenerator = new TokenGenerator()
    const sessionTokenService = new SessionTokenService(tokenGenerator, fastHasher)
    const emailVerificationTokenRepository = new PrismaEmailVerificationTokenRepository(fastify.prisma)
    const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository(fastify.prisma)
    const settingRepository = new PrismaSettingRepository(fastify.prisma)
    const workspaceRepository = new PrismaWorkspaceRepository(fastify.prisma)
    const workspaceMemberRepository = new PrismaWorkspaceMemberRepository(fastify.prisma)
    const workspaceMemberService = new WorkspaceMemberService(workspaceMemberRepository, userRepository, workspaceRepository)
    const workspaceAccessService = new WorkspaceAccessService(workspaceMemberRepository)
    const workspaceStatisticsQuery = new PrismaWorkspaceStatisticsQuery(fastify.prisma)
    const workspaceInvitationRepository = new PrismaWorkspaceInvitationRepository(fastify.prisma)
    const workspaceInvitationService = new WorkspaceInvitationService({
        workspaceInvitationRepository,
        userRepository,
        workspaceMemberRepository
    })
    const workspaceInvitationsWithWorkspaceQuery = new PrismaWorkspaceInvitationsWithWorkspaceQuery(fastify.prisma)
    const initiatorRepository = new PrismaInitiatorRepository(fastify.prisma)
    const initiatorService = new InitiatorService(initiatorRepository)
    const workspacesQuery = new PrismaWorkspacesQuery(fastify.prisma)
    const workspaceInvariantsService = new WorkspaceInvariantsService()
    const twoFactorMethodInvariantsService = new TwoFactorMethodInvariantsService(twoFactorMethodRepository)
    const totpService = new TotpService()
    const totpSetupService = new TotpSetupService(totpService, fastify.encryption, fastify.config)

    fastify.decorate('workspaceInvariantsService', workspaceInvariantsService)
    fastify.decorate('userRepository', userRepository)
    fastify.decorate('userCredentialRepository', userCredentialRepository)
    fastify.decorate('secureHasher', secureHasher)
    fastify.decorate('fastHasher', fastHasher)
    fastify.decorate('unitOfWork', unitOfWork)
    fastify.decorate('imageValidator', imageValidator)
    fastify.decorate('imageProcessor', imageProcessor)
    fastify.decorate('adminPermissionRepository', adminPermissionRepository)
    fastify.decorate('twoFactorConfigHandlerFactory', twoFactorConfigHandlerFactory)
    fastify.decorate('twoFactorMethodRepository', twoFactorMethodRepository)
    fastify.decorate('sessionRepository', sessionRepository)
    fastify.decorate('sessionTokenService', sessionTokenService)
    fastify.decorate('emailVerificationTokenRepository', emailVerificationTokenRepository)
    fastify.decorate('passwordResetTokenRepository', passwordResetTokenRepository)
    fastify.decorate('tokenGenerator', tokenGenerator)
    fastify.decorate('settingRepository', settingRepository)
    fastify.decorate('workspaceRepository', workspaceRepository)
    fastify.decorate('workspaceMemberRepository', workspaceMemberRepository)
    fastify.decorate('workspaceMemberService', workspaceMemberService)
    fastify.decorate('workspaceMemberServiceFactory', workspaceMemberServiceFactory)
    fastify.decorate('workspaceAccessService', workspaceAccessService)
    fastify.decorate('workspaceStatisticsQuery', workspaceStatisticsQuery)
    fastify.decorate('workspaceInvitationRepository', workspaceInvitationRepository)
    fastify.decorate('workspaceInvitationServiceFactory', workspaceInvitationServiceFactory)
    fastify.decorate('workspaceInvitationService', workspaceInvitationService)
    fastify.decorate('workspaceInvitationsWithWorkspaceQuery', workspaceInvitationsWithWorkspaceQuery)
    fastify.decorate('initiatorRepository', initiatorRepository)
    fastify.decorate('initiatorService', initiatorService)
    fastify.decorate('workspacesQuery', workspacesQuery)
    fastify.decorate('twoFactorMethodInvariantsService', twoFactorMethodInvariantsService)
    fastify.decorate('totpSetupService', totpSetupService)
    fastify.decorate('totpService', totpService)
}

export default fp(diPlugin, {
    name: 'di',
    dependencies: ['prisma'],
})