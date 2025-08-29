import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { SharpImageValidator } from '@/shared/infrastructure/services/sharp-image-validator.service.ts'
import { SharpImageProcessor } from '@/shared/infrastructure/services/sharp-image-processor.service.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'
import { PrismaUserAdminPermissionRepository } from '@/modules/admin-permission/infrastructure/repositories/prisma-user-admin-permission.repository.ts'
import { IUserAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/user-admin-permission-repository.interface.ts'
import { TwoFactorConfigHandlerFactory } from '@/modules/two-factor-auth/infrastructure/handlers/two-factor-config-handler.factory.ts'
import { PrismaTwoFactorMethodRepository } from '@/modules/two-factor-auth/infrastructure/repositories/prisma-two-factor-method.repository.ts'
import { ITwoFactorMethodRepository } from '@/modules/two-factor-auth/domain/ports/two-factor-method-repository.interface.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { ISessionRepository } from '@/modules/session/domain/ports/session-repository.interface.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { SessionTokenService } from '@/modules/session/domain/services/session-token.service.ts'
import { ISessionTokenService } from '@/modules/session/domain/ports/session-token-service.interface.ts'
import { PrismaEmailVerificationTokenRepository } from '@/modules/email-verification/infrastructure/repositories/prisma-email-verification-token.repository.ts'
import { IEmailVerificationTokenRepository } from '@/modules/email-verification/domain/ports/email-verification-token-repository.interface.ts'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'
import { PrismaPasswordResetTokenRepository } from '@/modules/password-reset/infrastructure/repositories/prisma-password-reset-token.repository.ts'
import { IPasswordResetTokenRepository } from '@/modules/password-reset/domain/ports/password-reset-token-repository.interface.ts'
import { ISettingRepository } from '@/modules/setting/domain/setting-repository.interface.ts'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { PrismaWorkspaceRepository } from '@/modules/workspace/infrastructure/repositories/prisma-workspace.repository.ts'
import { PrismaWorkspaceMemberRepository } from '@/modules/workspace-member/domain/infrastructure/repositories/prisma-workspace-member.repository.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { WorkspaceMemberService } from '@/modules/workspace-member/domain/services/workspace-member.service.ts'
import { IWorkspaceMemberService } from '@/modules/workspace-member/domain/ports/workspace-member-service.interface.ts'
import { workspaceMemberServiceFactory, IWorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'

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
    }
}

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

    fastify.decorate('userRepository', userRepository)
    fastify.decorate('userCredentialRepository', userCredentialRepository)
    fastify.decorate('secureHasher', secureHasher)
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
}

export default fp(diPlugin, {
    name: 'di',
    dependencies: ['prisma'],
})