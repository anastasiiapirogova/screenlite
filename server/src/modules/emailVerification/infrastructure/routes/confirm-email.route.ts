import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ConfirmEmailUseCase } from '../../application/usecases/confirm-email.usecase.ts'
import { PrismaEmailVerificationTokenRepository } from '../repositories/prisma-email-verification-token.repository.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { ConfirmEmailSchema } from '../schemas/confirm-email.schema.ts'

export async function confirmEmailRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm-email', {
        schema: {
            body: ConfirmEmailSchema
        },
    }, async (request, reply) => {
        const { token } = request.body

        const confirmEmail = new ConfirmEmailUseCase({
            tokenRepo: new PrismaEmailVerificationTokenRepository(fastify.prisma),
            userRepo: new PrismaUserRepository(fastify.prisma),
            hasher: new FastHasher(),
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
        })

        await confirmEmail.execute(token)

        reply.status(200).send({ message: 'EMAIL_CONFIRMED' })
    })
} 