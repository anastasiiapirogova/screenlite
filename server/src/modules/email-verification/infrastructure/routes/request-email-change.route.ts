import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestEmailChangeUseCase } from '../../application/usecases/request-email-change.usecase.ts'
import { EmailVerificationTokenFactory } from '../../domain/services/email-verification-token.factory.ts'
import { RequestEmailChangeSchema } from '../schemas/request-email-change.schema.ts'

export async function requestEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/request-email-change', {
        schema: {
            body: RequestEmailChangeSchema
        },
    }, async (request, reply) => {
        const { userId, newEmail } = request.body

        const tokenFactory = new EmailVerificationTokenFactory(fastify.tokenGenerator, fastify.fastHasher)

        const requestEmailChange = new RequestEmailChangeUseCase({
            userRepo: fastify.userRepository,
            tokenRepo: fastify.emailVerificationTokenRepository,
            tokenFactory,
            jobProducer: fastify.jobProducer,
            unitOfWork: fastify.unitOfWork,
            config: fastify.config,
        })

        await requestEmailChange.execute(userId, newEmail)

        reply.status(200).send({ message: 'EMAIL_CHANGE_REQUESTED' })
    })
} 