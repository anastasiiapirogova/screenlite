import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'
import { GetWorkspaceInvitationsByWorkspaceUsecase } from '@/modules/workspace-invitation/application/usecases/get-workspace-invitations-by-workspace.usecase.ts'

// Prefix: /api/workspaces
export const getWorkspaceInvitationsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/:workspaceId/invitations', {
        schema: {
            params: z.object({
                workspaceId: z.uuid(),
            }),
            querystring: paginationSchema.extend({
                status: z.array(z.enum(WorkspaceInvitationStatus)).optional()
            })
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params
            const { page, limit, status } = request.query

            const getWorkspaceInvitationsUseCase = new GetWorkspaceInvitationsByWorkspaceUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceInvitationRepository: fastify.workspaceInvitationRepository,
                    workspaceInvariantsService: fastify.workspaceInvariantsService
                }
            )

            const result = await getWorkspaceInvitationsUseCase.execute({
                authContext: request.auth,
                queryOptions: {
                    filters: {
                        workspaceId,
                        status
                    },
                    pagination: {
                        page,
                        limit
                    }
                }
            })

            return reply.status(200).send(result)
        }
    })
}