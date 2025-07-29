import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { LoginUsecase } from '@/modules/auth/application/usecases/login.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { loginSchema } from '../schemas/login.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'
import { SessionFactory } from '@/modules/session/domain/services/session.factory.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { UserMapper } from '@/core/mapper/user.mapper.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'

export const loginRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: loginSchema,
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const sessionFactory = new SessionFactory(new TokenGenerator(), new FastHasher())
        const userMapper = new UserMapper()
        const hasher = new BcryptHasher()

        const login = new LoginUsecase({
            userRepository: userRepo,
            sessionRepository: sessionRepo,
            passwordHasher: hasher,
            sessionFactory,
        })

        const result = await login.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(200).send({
            user: userMapper.toPublicDTO(result.user),
            token: result.token
        })
    })
} 