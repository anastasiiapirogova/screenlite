import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetActivePasswordResetTokenUsecase } from '../../application/usecases/get-active-password-reset-token.usecase.ts'

export const checkPasswordResetTokenRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/check', {
        schema: {
            body: z.object({
                token: z.string(),
            })
        },
        config: {
            allowGuest: true
        }
    }, async (request, reply) => {
        const { token } = request.body

        const getActivePasswordResetTokenUseCase = new GetActivePasswordResetTokenUsecase({
            passwordResetTokenRepo: fastify.passwordResetTokenRepository,
            hasher: fastify.secureHasher,
        })

        const passwordResetToken = await getActivePasswordResetTokenUseCase.execute(token)

        return reply.status(200).send({
            valid: !!passwordResetToken,
        })
    })
}
