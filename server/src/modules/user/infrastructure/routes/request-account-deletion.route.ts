import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RequestAccountDeletionUsecase } from '@/modules/user/application/usecases/request-account-deletion.usecase.ts'
import { RequestAccountDeletionDTO } from '@/modules/user/application/dto/request-account-deletion.dto.ts'
import z from 'zod'

// Prefix: /api/users
export const requestAccountDeletionRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        '/:userId/request-account-deletion',
        {
            schema: {
                params: z.object({
                    userId: z.uuid()
                })
            }
        },
        async (request, reply) => {
            const userId = request.params.userId

            const dto: RequestAccountDeletionDTO = {
                userId,
                authContext: request.auth,
            }

            const requestDeletion = new RequestAccountDeletionUsecase(
                fastify.userRepository,
                fastify.unitOfWork,
            )

            await requestDeletion.execute(dto)

            return reply.status(202).send({ 
                message: 'ACCOUNT_DELETION_REQUESTED'
            })
        }
    )
}