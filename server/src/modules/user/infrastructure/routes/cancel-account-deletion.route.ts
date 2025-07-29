import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CancelAccountDeletionUsecase } from '@/modules/user/application/usecases/cancel-account-deletion.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { CancelAccountDeletionDTO } from '@/modules/user/application/dto/cancel-account-deletion.dto.ts'
import z from 'zod'

export const cancelAccountDeletionRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        '/:userId/cancel-account-deletion',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                })
            },
        },
        async (request, reply) => {
            const userId = request.params.userId

            const dto: CancelAccountDeletionDTO = {
                userId,
                authContext: request.auth,
            }

            const cancelDeletion = new CancelAccountDeletionUsecase(
                new PrismaUserRepository(fastify.prisma)
            )

            await cancelDeletion.execute(dto)

            return reply.status(202).send({
                message: 'ACCOUNT_DELETION_CANCELLATION_SUCCESSFUL'
            })
        }
    )
} 