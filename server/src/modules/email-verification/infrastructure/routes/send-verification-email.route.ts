import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { SendVerificationEmailUseCase } from '../../application/usecases/send-verification-email.usecase.ts'
import { EmailVerificationTokenFactory } from '../../domain/services/email-verification-token.factory.ts'
import { SendVerificationEmailSchema } from '../schemas/send-verification-email.schema.ts'

export async function sendVerificationEmailRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/send-verification-email', {
        schema: {
            body: SendVerificationEmailSchema
        },
    }, async (request, reply) => {
        const { userId } = request.body

        const tokenFactory = new EmailVerificationTokenFactory(fastify.tokenGenerator, fastify.secureHasher)

        const sendVerificationEmail = new SendVerificationEmailUseCase({
            userRepo: fastify.userRepository,
            tokenRepo: fastify.emailVerificationTokenRepository,
            tokenFactory,
            jobProducer: fastify.jobProducer,
            config: fastify.config,
        })

        await sendVerificationEmail.execute(userId)

        reply.status(200).send({ message: 'VERIFICATION_EMAIL_SENT' })
    })
} 