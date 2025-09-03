import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { RespondToWorkspaceInvitationUsecase } from '../../application/usecases/respond-to-workspace-invitation.usecase.ts'

// Prefix: /api/workspace-invitations
export const rejectWorkspaceInvitationRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/:workspaceInvitationId/reject', {
        schema: {
            params: z.object({  
                workspaceInvitationId: z.string(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceInvitationId } = request.params

            const rejectWorkspaceInvitationUseCase = new RespondToWorkspaceInvitationUsecase({
                workspaceInvitationRepository: fastify.workspaceInvitationRepository,
                workspaceMemberServiceFactory: fastify.workspaceMemberServiceFactory,
                workspaceInvitationServiceFactory: fastify.workspaceInvitationServiceFactory,
                unitOfWork: fastify.unitOfWork,
                workspaceInvariantsService: fastify.workspaceInvariantsService,
                workspaceRepository: fastify.workspaceRepository,
            })

            await rejectWorkspaceInvitationUseCase.execute({
                authContext: request.auth,
                invitationId: workspaceInvitationId,
                accept: false,
            })

            return reply.status(200).send({
                message: 'WORKSPACE_INVITATION_REJECTED'
            })
        }
    })
}