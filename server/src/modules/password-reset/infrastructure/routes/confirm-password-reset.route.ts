import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaPasswordResetTokenRepository } from '../repositories/prisma-password-reset-token.repository.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import z from 'zod'
import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { ConfirmPasswordResetUsecase } from '../../application/usecases/confirm-password-reset.usecase.ts'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'

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

        const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
        const userRepo = new PrismaUserRepository(fastify.prisma)
        const passwordResetTokenRepo = new PrismaPasswordResetTokenRepository(fastify.prisma)
        const passwordHasher = new BcryptHasher()
        const hasher = new FastHasher()
        const userCredentialRepo = new PrismaUserCredentialRepository(fastify.prisma)
        
        const confirmPasswordResetUseCase = new ConfirmPasswordResetUsecase({
            unitOfWork,
            userRepo,
            passwordResetTokenRepo,
            hasher,
            passwordHasher,
            userCredentialRepo,
        })

        await confirmPasswordResetUseCase.execute({ token, password })

        return reply.status(200).send({
            message: 'PASSWORD_RESET_CONFIRMED'
        })
    })
}
