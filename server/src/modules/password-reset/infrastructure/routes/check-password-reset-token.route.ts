import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { PrismaPasswordResetTokenRepository } from '../repositories/prisma-password-reset-token.repository.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
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

        const passwordResetTokenRepo = new PrismaPasswordResetTokenRepository(fastify.prisma)
        const hasher = new FastHasher()

        const getActivePasswordResetTokenUseCase = new GetActivePasswordResetTokenUsecase({
            passwordResetTokenRepo,
            hasher,
        })

        const passwordResetToken = await getActivePasswordResetTokenUseCase.execute(token)

        return reply.status(200).send({
            valid: !!passwordResetToken,
        })
    })
}
