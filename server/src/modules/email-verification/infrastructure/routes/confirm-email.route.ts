import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ConfirmEmailUseCase } from '../../application/usecases/confirm-email.usecase.ts'
import { ConfirmEmailSchema } from '../schemas/confirm-email.schema.ts'

export async function confirmEmailRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm-email', {
        schema: {
            body: ConfirmEmailSchema
        },
    }, async (request, reply) => {
        const { token } = request.body

        const confirmEmail = new ConfirmEmailUseCase({
            tokenRepo: fastify.emailVerificationTokenRepository,
            userRepo: fastify.userRepository,
            hasher: fastify.secureHasher,
            unitOfWork: fastify.unitOfWork,
        })

        await confirmEmail.execute(token)

        reply.status(200).send({ message: 'EMAIL_CONFIRMED' })
    })
} 