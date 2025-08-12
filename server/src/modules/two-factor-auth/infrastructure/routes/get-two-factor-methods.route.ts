import { FastifyInstance } from 'fastify'
import { PrismaTwoFactorMethodRepository } from '../repositories/prisma-two-factor-method.repository.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { TwoFactorConfigHandlerFactory } from '../handlers/two-factor-config-handler.factory.ts'
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

        const usecase = new GetUserTwoFactorMethodsUsecase(
            new PrismaTwoFactorMethodRepository(fastify.prisma, new TwoFactorConfigHandlerFactory(fastify.prisma)),
            new PrismaUserRepository(fastify.prisma)
        )

        const result = await usecase.execute(userId, request.auth)

        return reply.status(200).send(result)
    })
}