import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ConfirmEmailChangeSchema } from '../schemas/confirm-email-change.schema.ts'
import { ConfirmEmailChangeUseCase } from '../../application/usecases/confirm-email-change.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaEmailVerificationTokenRepository } from '../repositories/prisma-email-verification-token.repository.ts'
import { FastHasher } from '@/shared/infrastructure/services/fast-hasher.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'

export async function confirmEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm-email-change', {
        schema: {
            body: ConfirmEmailChangeSchema
        },
    }, async (request, reply) => {
        const { token } = request.body

        const confirmEmailChange = new ConfirmEmailChangeUseCase({
            tokenRepo: new PrismaEmailVerificationTokenRepository(fastify.prisma),
            userRepo: new PrismaUserRepository(fastify.prisma),
            hasher: new FastHasher(),
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
        })

        await confirmEmailChange.execute(token)

        reply.status(200).send({ message: 'EMAIL_CHANGE_CONFIRMED' })
    })
}