import { NodeSessionTokenService } from '@/modules/session/domain/services/node-session-token.service.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { LoginUsecase } from '@/modules/auth/application/usecases/login.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BcryptPasswordHasher } from '@/shared/infrastructure/services/bcrypt-password-hasher.service.ts'
import { loginSchema } from '../schemas/login.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'

export const loginRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: loginSchema,
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const sessionFactory = new SessionFactory(new NodeSessionTokenService())
        const passwordHasher = new BcryptPasswordHasher()

        const login = new LoginUsecase(
            userRepo,
            sessionRepo,
            passwordHasher,
            sessionFactory,
        )

        const result = await login.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(200).send({
            user: result.user.toPublicDTO(),
            token: result.token
        })
    })
} 