import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { SendVerificationEmailUseCase } from '../../application/usecases/send-verification-email.usecase.ts'
import { PrismaEmailVerificationTokenRepository } from '../repositories/prisma-email-verification-token.repository.ts'
import { EmailVerificationTokenFactory } from '../../domain/services/email-verification-token.factory.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { SendVerificationEmailSchema } from '../schemas/send-verification-email.schema.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'

export async function sendVerificationEmailRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/send-verification-email', {
        schema: {
            body: SendVerificationEmailSchema
        },
        onRequest: [fastify.requireAuth],
    }, async (request, reply) => {
        const { userId } = request.body

        const tokenGenerator = new TokenGenerator()
        const hasher = new FastHasher()

        const sendVerificationEmail = new SendVerificationEmailUseCase({
            userRepo: new PrismaUserRepository(fastify.prisma),
            tokenRepo: new PrismaEmailVerificationTokenRepository(fastify.prisma),
            tokenFactory: new EmailVerificationTokenFactory(tokenGenerator, hasher),
            jobProducer: fastify.jobProducer,
            config: fastify.config,
        })

        await sendVerificationEmail.execute(userId)

        reply.status(200).send({ message: 'VERIFICATION_EMAIL_SENT' })
    })
} 