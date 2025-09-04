import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { SoftDeleteWorkspaceUsecase } from '../../application/usecases/soft-delete-workspace.usecase.ts'

// Prefix: /api/workspaces
export const deleteWorkspaceRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().delete('/:workspaceId', {
        schema: {
            params: z.object({
                workspaceId: z.uuid(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params

            const deleteWorkspaceUseCase = new SoftDeleteWorkspaceUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceInvariantsService: fastify.workspaceInvariantsService
                }
            )

            await deleteWorkspaceUseCase.execute(workspaceId, request.auth)

            return reply.status(204).send()
        }
    })
}