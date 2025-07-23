import { NodeSessionTokenService } from '@/modules/session/domain/services/node-session-token.service.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'
import { SignupUsecase } from '@/modules/auth/application/usecases/signup.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BcryptPasswordHasher } from '@/shared/infrastructure/services/bcrypt-password-hasher.service.ts'
import { signupSchema } from '../schemas/signup.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'

export const signupRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/signup', {
        schema: {
            body: signupSchema,
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const sessionRepo = new PrismaSessionRepository(fastify.prisma)
        const tokenGen = new NodeSessionTokenService()
        const passwordHasher = new BcryptPasswordHasher()

        const signup = new SignupUsecase(
            userRepo,
            sessionRepo,
            tokenGen,
            passwordHasher
        )

        const result = await signup.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(201).send({ 
            user: result.user.toPublicDTO(), 
            token: result.token 
        })
    })
}