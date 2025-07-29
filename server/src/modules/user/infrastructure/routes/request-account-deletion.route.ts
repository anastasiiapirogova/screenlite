import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestAccountDeletionUsecase } from '@/modules/user/application/usecases/request-account-deletion.usecase.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { RequestAccountDeletionDTO } from '@/modules/user/application/dto/request-account-deletion.dto.ts'
import z from 'zod'
import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'

export const requestAccountDeletionRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        '/:userId/request-account-deletion',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                })
            },
            onRequest: [fastify.requireAuth],
            config: {
                requireActiveUser: true
            }
        },
        async (request, reply) => {
            const userId = request.params.userId
            let sessionTokenHash = undefined

            if(request.auth?.isUserContext()) {
                const session = (request.auth as UserSessionAuthContext).session

                sessionTokenHash = session.tokenHash
            }

            const dto: RequestAccountDeletionDTO = {
                userId,
                requester: request.auth!,
                currentSessionTokenHash: sessionTokenHash
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