import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestEmailChangeUseCase } from '../../application/usecases/request-email-change.usecase.ts'
import { PrismaEmailVerificationTokenRepository } from '../repositories/prisma-email-verification-token.repository.ts'
import { EmailVerificationTokenFactory } from '../../domain/services/email-verification-token.factory.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { RequestEmailChangeSchema } from '../schemas/request-email-change.schema.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'

export async function requestEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/request-email-change', {
        schema: {
            body: RequestEmailChangeSchema
        },
        onRequest: [fastify.requireAuth],
    }, async (request, reply) => {
        const { userId, newEmail } = request.body

        const tokenGenerator = new TokenGenerator()
        const hasher = new FastHasher()

        const requestEmailChange = new RequestEmailChangeUseCase({
            userRepo: new PrismaUserRepository(fastify.prisma),
            tokenRepo: new PrismaEmailVerificationTokenRepository(fastify.prisma),
            tokenFactory: new EmailVerificationTokenFactory(tokenGenerator, hasher),
            jobProducer: fastify.jobProducer,
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
            config: fastify.config,
        })

        await requestEmailChange.execute(userId, newEmail)

        reply.status(200).send({ message: 'EMAIL_CHANGE_REQUESTED' })
    })
} 