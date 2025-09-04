import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CompleteTotpSetupUsecase } from '../../application/usecases/complete-totp-setup.usecase.ts'
import { VerifyTotpCodeUsecase } from '../../application/usecases/verify-totp-code.usecase.ts'
import { totpCodeSchema } from '@/shared/schemas/totp-code.schema.ts'
import { TotpService } from '../services/totp.service.ts'

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

        const verifyTotpCodeUsecase = new VerifyTotpCodeUsecase({
            twoFactorMethodRepo: fastify.twoFactorMethodRepository,
            encryptionService: fastify.encryption,
            totpService: new TotpService(),
        })

        const completeTotpSetupUsecase = new CompleteTotpSetupUsecase({
            twoFactorMethodRepo: fastify.twoFactorMethodRepository,
            verifyTotpCodeUsecase,
            userRepo: fastify.userRepository,
            twoFactorMethodInvariantsService: fastify.twoFactorMethodInvariantsService,
        })

        await completeTotpSetupUsecase.execute(authContext, {
            userId,
            totpCode: request.body.totpCode
        })

        return reply.status(200).send({
            message: 'TOTP_SETUP_COMPLETED'
        })
    })
}