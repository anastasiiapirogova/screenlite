import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { deleteUserWorkspaceInvitationSchema } from '../schemas/workspaceUserInvitationSchemas.js'
import { WorkspaceUserInvitationRepository } from '../repositories/WorkspaceUserInvitationRepository.js'

export const deleteUserWorkspaceInvitation = async (req: Request, res: Response) => {
    const validation = deleteUserWorkspaceInvitationSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceUserInvitationId } = validation.data

    const workspaceUserInvitation = await WorkspaceUserInvitationRepository.find(workspaceUserInvitationId)

    if (!workspaceUserInvitation) {
        return ResponseHandler.notFound(res)
    }

    const isPending = workspaceUserInvitation.status === WorkspaceUserInvitationRepository.STATUS.PENDING

    if(!isPending) {
        return ResponseHandler.validationError(req, res, {
            workspaceUserInvitationId: 'INVITATION_NOT_PENDING',
        })
    }

    const updatedInvitation = await WorkspaceUserInvitationRepository.deleteInvitation(workspaceUserInvitationId)
   
    ResponseHandler.json(res, {
        invitation: updatedInvitation
    })
}
