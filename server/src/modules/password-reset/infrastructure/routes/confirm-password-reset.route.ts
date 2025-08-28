import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { ConfirmPasswordResetUsecase } from '../../application/usecases/confirm-password-reset.usecase.ts'

export const confirmPasswordResetRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm', {
        schema: {
            body: z.object({
                token: z.string(),
                password: passwordSchema
            })
        },
        config: {
            allowGuest: true
        }
    }, async (request, reply) => {
        const { token, password } = request.body

        const confirmPasswordResetUseCase = new ConfirmPasswordResetUsecase({
            unitOfWork: fastify.unitOfWork,
            userRepo: fastify.userRepository,
            passwordResetTokenRepo: fastify.passwordResetTokenRepository,
            hasher: fastify.secureHasher,
            passwordHasher: fastify.secureHasher,
            userCredentialRepo: fastify.userCredentialRepository,
        })

        await confirmPasswordResetUseCase.execute({ token, password })

        return reply.status(200).send({
            message: 'PASSWORD_RESET_CONFIRMED'
        })
    })
}
