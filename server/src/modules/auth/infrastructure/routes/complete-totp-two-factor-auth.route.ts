import { VerifyTotpCodeUsecase } from '@/modules/two-factor-auth/application/usecases/verify-totp-code.usecase.ts'
import { totpCodeSchema } from '@/shared/schemas/totp-code.schema.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { CompleteTotpTwoFactorAuthUsecase } from '../../application/usecases/complete-totp-two-factor-auth.usecase.ts'
import { TotpService } from '@/modules/two-factor-auth/infrastructure/services/totp.service.ts'

export const completeTotpTwoFactorAuthRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/two-factor-auth/totp/complete', {
        schema: {
            body: z.object({
                totpCode: totpCodeSchema,
            }),
        },
    }, async (request, reply) => {
        const { totpCode } = request.body
        const authContext = request.auth

        if (!authContext.isUserContext()) {
            return fastify.httpErrors.unauthorized()
        }

        const verifyTotpCodeUsecase = new VerifyTotpCodeUsecase({
            twoFactorMethodRepo: fastify.twoFactorMethodRepository,
            encryptionService: fastify.encryption,
            totpService: new TotpService(),
        })

        const completeTotpTwoFactorAuthUsecase = new CompleteTotpTwoFactorAuthUsecase({
            verifyTotpCodeUsecase,
            sessionRepo: fastify.sessionRepository,
        })

        await completeTotpTwoFactorAuthUsecase.execute(authContext, totpCode)

        return reply.status(200).send()
    })
}