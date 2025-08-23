import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { SignupUsecase } from '@/modules/auth/application/usecases/signup.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { signupSchema } from '../schemas/signup.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { SessionTokenService } from '@/modules/session/domain/services/session-token.service.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'

export const signupRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/signup', {
        schema: {
            body: signupSchema,
        },
        config: {
            allowGuest: true,
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const sessionTokenService = new SessionTokenService(new TokenGenerator(), new FastHasher())
        const userCredentialRepo = new PrismaUserCredentialRepository(fastify.prisma)
        const hasher = new BcryptHasher()
        const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
        const userMapper = new UserMapper()

        const signup = new SignupUsecase({
            userRepository: userRepo,
            sessionRepository: sessionRepo,
            sessionTokenService,
            passwordHasher: hasher,
            unitOfWork,
            userCredentialRepository: userCredentialRepo
        })

        const result = await signup.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(201).send({ 
            user: userMapper.toPublicDTO(result.user), 
            token: result.token 
        })
    })
}