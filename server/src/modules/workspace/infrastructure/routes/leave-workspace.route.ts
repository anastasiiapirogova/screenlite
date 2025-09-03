import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { LeaveWorkspaceUsecase } from '@/modules/workspace-member/application/usecases/leave-workspace.usecase.ts'

// Prefix: /api/workspaces
export const leaveWorkspaceRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/:workspaceId/leave', {
        schema: {
            params: z.object({
                workspaceId: z.uuid(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params

            const leaveWorkspaceUseCase = new LeaveWorkspaceUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceAccessService: fastify.workspaceAccessService,
                    workspaceMemberService: fastify.workspaceMemberService,
                }
            )

            await leaveWorkspaceUseCase.execute(request.auth, workspaceId)

            return reply.status(204).send()
        }
    })
}