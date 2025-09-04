import { FastifyInstance } from 'fastify'
import { GetTotpSetupDataUsecase } from '../../application/usecases/get-totp-setup-data.usecase.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { TotpConfigMapper } from '../mappers/totp-config.mapper.ts'

// Prefix: /api/two-factor-auth/
export const getTotpSetupDataRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/users/:userId/setup/totp', {
        schema: {
            params: z.object({
                userId: z.uuid()
            })
        }
    }, async (request, reply) => {
        const authContext = request.auth

        const userId = request.params.userId

        const getTotpSetupDataUsecase = new GetTotpSetupDataUsecase({
            twoFactorMethodRepo: fastify.twoFactorMethodRepository,
            totpService: fastify.totpService,
            config: fastify.config,
            encryptionService: fastify.encryption,
            userRepo: fastify.userRepository,
            unitOfWork: fastify.unitOfWork,
            totpSetupService: fastify.totpSetupService,
        })

        const mapper = new TotpConfigMapper()

        const result = await getTotpSetupDataUsecase.execute(authContext, userId)

        const setupTotpConfigDTO = mapper.toSetupTotpConfigDTO(result.totpConfig, result.secret, result.url)

        return reply.status(200).send(setupTotpConfigDTO)
    })
}