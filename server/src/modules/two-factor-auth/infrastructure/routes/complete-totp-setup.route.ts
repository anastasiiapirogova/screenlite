import { FastifyInstance } from 'fastify'
import { PrismaTwoFactorMethodRepository } from '../repositories/prisma-two-factor-method.repository.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { TwoFactorConfigHandlerFactory } from '../handlers/two-factor-config-handler.factory.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CompleteTotpSetupUsecase } from '../../application/usecases/complete-totp-setup.usecase.ts'
import { VerifyTotpCodeUsecase } from '../../application/usecases/verify-totp-code.usecase.ts'
import { totpCodeSchema } from '@/shared/schemas/totp-code.schema.ts'

// Prefix: /api/two-factor-auth/
export const completeTotpSetupRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/users/:userId/setup/totp', {
        schema: {
            params: z.object({
                userId: z.uuid()
            }),
            body: z.object({
                totpCode: totpCodeSchema
            })
        }
    }, async (request, reply) => {
        const authContext = request.auth

        const userId = request.params.userId

        const usecase = new CompleteTotpSetupUsecase({
            twoFactorMethodRepo: new PrismaTwoFactorMethodRepository(fastify.prisma, new TwoFactorConfigHandlerFactory(fastify.prisma)),
            verifyTotpCodeUsecase: new VerifyTotpCodeUsecase({
                twoFactorMethodRepo: new PrismaTwoFactorMethodRepository(fastify.prisma, new TwoFactorConfigHandlerFactory(fastify.prisma)),
                encryptionService: fastify.encryption,
            }),
            userRepo: new PrismaUserRepository(fastify.prisma),
        })

        const result = await usecase.execute(authContext, {
            userId,
            totpCode: request.body.totpCode
        })

        return reply.status(200).send(result)
    })
}