import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestAccountDeletionUsecase } from '@/modules/user/application/usecases/request-account-deletion.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { RequestAccountDeletionDTO } from '@/modules/user/application/dto/request-account-deletion.dto.ts'
import z from 'zod'

export const requestAccountDeletionRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        '/:userId/request-account-deletion',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                })
            },
            config: {
                requireActiveUser: true
            }
        },
        async (request, reply) => {
            const userId = request.params.userId

            const dto: RequestAccountDeletionDTO = {
                userId,
                authContext: request.auth,
            }

            const requestDeletion = new RequestAccountDeletionUsecase(
                new PrismaUserRepository(fastify.prisma),
                new PrismaUnitOfWork(fastify.prisma)
            )

            await requestDeletion.execute(dto)

            return reply.status(202).send({ 
                message: 'ACCOUNT_DELETION_REQUESTED'
            })
        }
    )
}