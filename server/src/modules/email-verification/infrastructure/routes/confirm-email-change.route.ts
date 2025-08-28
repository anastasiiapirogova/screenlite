import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ConfirmEmailChangeSchema } from '../schemas/confirm-email-change.schema.ts'
import { ConfirmEmailChangeUseCase } from '../../application/usecases/confirm-email-change.usecase.ts'

export async function confirmEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm-email-change', {
        schema: {
            body: ConfirmEmailChangeSchema
        },
    }, async (request, reply) => {
        const { token } = request.body

        const confirmEmailChange = new ConfirmEmailChangeUseCase({
            tokenRepo: fastify.emailVerificationTokenRepository,
            userRepo: fastify.userRepository,
            hasher: fastify.secureHasher,
            unitOfWork: fastify.unitOfWork,
        })

        await confirmEmailChange.execute(token)

        reply.status(200).send({ message: 'EMAIL_CHANGE_CONFIRMED' })
    })
}