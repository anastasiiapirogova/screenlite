import { FastifyInstance } from 'fastify'
import { GetTotpSetupDataUsecase } from '../../application/usecases/get-totp-setup-data.usecase.ts'
import { PrismaTwoFactorMethodRepository } from '../repositories/prisma-two-factor-method.repository.ts'
import { TotpService } from '../services/totp.service.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { TwoFactorConfigHandlerFactory } from '../handlers/two-factor-config-handler.factory.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

// Prefix: /api/two-factor-auth/
export const getTwoFactorAuthSetupDataRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/users/:userId/setup/totp', {
        schema: {
            params: z.object({
                userId: z.uuid()
            })
        }
    }, async (request, reply) => {
        const authContext = request.auth

        const userId = request.params.userId

        const usecase = new GetTotpSetupDataUsecase({
            twoFactorMethodRepo: new PrismaTwoFactorMethodRepository(fastify.prisma, new TwoFactorConfigHandlerFactory(fastify.prisma)),
            totpService: new TotpService(),
            config: fastify.config,
            encryptionService: fastify.encryption,
            userRepo: new PrismaUserRepository(fastify.prisma),
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
        })

        const result = await usecase.execute(authContext, userId)

        return reply.status(200).send(result)
    })
}