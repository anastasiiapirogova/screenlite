import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { LeaveWorkspaceUsecase } from '@/modules/workspace-member/application/usecases/leave-workspace.usecase.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

// Prefix: /api/workspaces
export const leaveWorkspaceRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/:workspaceId/leave', {
        schema: {
            params: z.object({
                workspaceId: z.string(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceId } = request.params

            if(!request.auth.isUserContext()) {
                throw new ForbiddenError({
                    auth: ['ONLY_USER_CAN_LEAVE_WORKSPACE']
                })
            }

            const leaveWorkspaceUseCase = new LeaveWorkspaceUsecase(
                {
                    workspaceRepository: fastify.workspaceRepository,
                    workspaceMemberRepository: fastify.workspaceMemberRepository,
                    workspaceMemberServiceFactory: fastify.workspaceMemberServiceFactory,
                    unitOfWork: fastify.unitOfWork
                }
            )

            await leaveWorkspaceUseCase.execute(request.auth.user.id, workspaceId)

            return reply.status(204).send()
        }
    })
}