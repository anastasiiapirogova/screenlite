import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CancelEmailChangeSchema } from '../schemas/cancel-email-change.schema.ts'
import { CancelEmailChangeUseCase } from '../../application/usecases/cancel-email-change.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'

export async function cancelEmailChangeRoute(fastify: FastifyInstance) {
    fastify.withTypeProvider<ZodTypeProvider>().post('/cancel-email-change', {
        schema: {
            body: CancelEmailChangeSchema
        },
        onRequest: [fastify.requireAuth],
    }, async (request, reply) => {
        const { userId } = request.body

        const cancelEmailChange = new CancelEmailChangeUseCase({
            userRepo: new PrismaUserRepository(fastify.prisma),
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
        })

        await cancelEmailChange.execute(userId)
        
        reply.status(200).send({ message: 'EMAIL_CHANGE_CANCELLED' })
    })
}