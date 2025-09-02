import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { RespondToWorkspaceInvitationUsecase } from '../../application/usecases/respond-to-workspace-invitation.usecase.ts'

// Prefix: /api/workspace-invitations
export const acceptWorkspaceInvitationRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/:workspaceInvitationId/accept', {
        schema: {
            params: z.object({  
                workspaceInvitationId: z.string(),
            }),
        },
        handler: async (request, reply) => {
            const { workspaceInvitationId } = request.params

            const acceptWorkspaceInvitationUseCase = new RespondToWorkspaceInvitationUsecase({
                workspaceInvitationRepository: fastify.workspaceInvitationRepository,
                workspaceMemberServiceFactory: fastify.workspaceMemberServiceFactory,
                workspaceInvitationServiceFactory: fastify.workspaceInvitationServiceFactory,
                unitOfWork: fastify.unitOfWork
            })

            await acceptWorkspaceInvitationUseCase.execute({
                authContext: request.auth,
                invitationId: workspaceInvitationId,
                accept: true,
            })

            return reply.status(200).send({
                message: 'WORKSPACE_INVITATION_ACCEPTED'
            })
        }
    })
}