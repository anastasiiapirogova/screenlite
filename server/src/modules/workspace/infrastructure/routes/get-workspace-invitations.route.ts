import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { GetWorkspaceInvitationsUsecase } from '@/modules/workspace-invitation/application/usecases/get-workspace-invitations.usecase.ts'
import { paginationSchema } from '@/shared/schemas/pagination.schema.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'

// Prefix: /api/workspaces
export const getWorkspaceInvitationsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/:workspaceId/invitations', {
        schema: {
            params: z.object({
                workspaceId: z.string(),
            }),
            querystring: paginationSchema.extend({
                status: z.array(z.enum(WorkspaceInvitationStatus)).optional()
            })
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params
            const { page, limit, status } = request.query

            const getWorkspaceInvitationsUseCase = new GetWorkspaceInvitationsUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceInvitationRepository: fastify.workspaceInvitationRepository
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