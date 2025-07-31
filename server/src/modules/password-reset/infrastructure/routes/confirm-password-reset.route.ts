import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaPasswordResetTokenRepository } from '../repositories/prisma-password-reset-token.repository.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import z from 'zod'
import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { ConfirmPasswordResetUsecase } from '../../application/usecases/confirm-password-reset.usecase.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'
import { LoginUsecase } from '@/modules/auth/application/usecases/login.usecase.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { UserMapper } from '@/core/mapper/user.mapper.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'

export const confirmPasswordResetRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body: z.object({
                token: z.string(),
                email: z.string().optional(),
                password: passwordSchema
            })
        },
        config: {
            allowGuest: true
        }
    }, async (request, reply) => {
        const { token, password, email } = request.body

        const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const passwordResetTokenRepo = new PrismaPasswordResetTokenRepository(fastify.prisma)
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const passwordHasher = new BcryptHasher()
        const hasher = new FastHasher()
        const userMapper = new UserMapper()
        const requestAdapter = new FastifyRequestAdapter(request)

        const confirmPasswordResetUseCase = new ConfirmPasswordResetUsecase({
            unitOfWork,
            userRepo,
            passwordResetTokenRepo,
            hasher,
            passwordHasher,
        })

        await confirmPasswordResetUseCase.execute({ token, password })

        if (email) {
            const loginUseCase = new LoginUsecase({
                userRepository: userRepo,
                sessionRepository: sessionRepo,
                passwordHasher,
                sessionFactory: new SessionFactory(new TokenGenerator(), hasher),
            })

            try {
                const { user, token: sessionToken } = await loginUseCase.execute({
                    email,
                    password,
                    userAgent: requestAdapter.getUserAgent(),
                    ipAddress: requestAdapter.getIP(),
                })

                return reply.status(200).send({
                    user: userMapper.toPublicDTO(user),
                    token: sessionToken,
                })
            } catch {
                // Fall through to return generic reset confirmation
            }
        }

        return reply.status(200).send({
            message: 'PASSWORD_RESET_CONFIRMED'
        })
    })
}
