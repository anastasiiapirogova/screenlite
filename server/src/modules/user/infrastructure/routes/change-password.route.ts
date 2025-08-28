import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { ChangePasswordUseCase } from '../../application/usecases/change-password.usecase.ts'
import { currentPasswordSchema, passwordSchema } from '@/shared/schemas/user-password.schema.ts'

// Prefix: /api/users
export const changePasswordRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().put('/:userId/password', {
        schema: {
            params: z.object({
                userId: z.uuid(),
            }),
            body: z.object({
                newPassword: passwordSchema,
                currentPassword: currentPasswordSchema,
            }),
        },
        handler: async (request, reply) => {
            const { userId } = request.params
            const { newPassword, currentPassword } = request.body

            const changePasswordUseCase = new ChangePasswordUseCase({
                unitOfWork: fastify.unitOfWork,
                userRepository: fastify.userRepository,
                passwordHasher: fastify.secureHasher,
                userCredentialRepository: fastify.userCredentialRepository,
            })

            await changePasswordUseCase.execute({
                authContext: request.auth,
                userId,
                password: newPassword,
                currentPassword,
            })

            return reply.status(200).send({
                message: 'PASSWORD_CHANGED'
            })
        }
    })
}