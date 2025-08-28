import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { PasswordResetTokenFactory } from '../../domain/services/password-reset-token.factory.ts'
import { RequestPasswordResetUsecase } from '../../application/usecases/request-password-reset.usecase.ts'

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
        const passwordResetTokenFactory = new PasswordResetTokenFactory(fastify.tokenGenerator, fastify.secureHasher)

        const requestPasswordResetUseCase = new RequestPasswordResetUsecase({
            unitOfWork: fastify.unitOfWork,
            userRepo: fastify.userRepository,
            passwordResetTokenRepo: fastify.passwordResetTokenRepository,
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