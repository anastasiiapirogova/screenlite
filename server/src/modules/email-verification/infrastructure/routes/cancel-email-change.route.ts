import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CancelEmailChangeSchema } from '../schemas/cancel-email-change.schema.ts'
import { CancelEmailChangeUseCase } from '../../application/usecases/cancel-email-change.usecase.ts'

export async function cancelEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/cancel-email-change', {
        schema: {
            body: CancelEmailChangeSchema
        },
    }, async (request, reply) => {
        const { userId } = request.body

        const cancelEmailChange = new CancelEmailChangeUseCase({
            userRepo: fastify.userRepository,
            unitOfWork: fastify.unitOfWork,
        })

        await cancelEmailChange.execute(userId)
        
        reply.status(200).send({ message: 'EMAIL_CHANGE_CANCELLED' })
    })
}