import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestPasswordResetUsecase } from '../../application/usecases/request-password-reset.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaPasswordResetTokenRepository } from '../repositories/prisma-password-reset-token.repository.ts'
import { TokenGenerator } from '@/shared/infrastructure/services/token-generator.service.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import z from 'zod'
import { PasswordResetTokenFactory } from '../../domain/services/password-reset-token.factory.ts'

export const requestPasswordResetRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body: z.object({
                email: z.email()
            })
        },
        config: {
            allowGuest: true
        }
    }, async (request, reply) => {
        const { email } = request.body
        const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const passwordResetTokenRepo = new PrismaPasswordResetTokenRepository(fastify.prisma)
        const passwordResetTokenFactory = new PasswordResetTokenFactory(new TokenGenerator(), new FastHasher())

        const requestPasswordResetUseCase = new RequestPasswordResetUsecase({
            unitOfWork,
            userRepo,
            passwordResetTokenRepo,
            config: fastify.config,
            jobProducer: fastify.jobProducer,
            passwordResetTokenFactory
        })

        await requestPasswordResetUseCase.execute({ email })

        return reply.status(200).send({
            message: 'PASSWORD_RESET_REQUESTED'
        })
    })
} 