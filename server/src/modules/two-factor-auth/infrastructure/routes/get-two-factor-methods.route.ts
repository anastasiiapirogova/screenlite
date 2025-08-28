import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetUserTwoFactorMethodsUsecase } from '../../application/usecases/get-user-two-factor-methods.usecase.ts'

// Prefix: /api/two-factor-auth/
export const getTwoFactorMethodsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/users/:userId/methods', {
        schema: {
            params: z.object({
                userId: z.uuid()
            })
        },
        config: {
            allowSkipTwoFactorAuth: true,
        }
    }, async (request, reply) => {
        const userId = request.params.userId

        const getUserTwoFactorMethodsUsecase = new GetUserTwoFactorMethodsUsecase(
            fastify.twoFactorMethodRepository,
            fastify.userRepository
        )

        const result = await getUserTwoFactorMethodsUsecase.execute(userId, request.auth)

        return reply.status(200).send(result)
    })
}