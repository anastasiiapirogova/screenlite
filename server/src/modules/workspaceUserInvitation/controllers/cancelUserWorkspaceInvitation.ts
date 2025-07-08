import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { cancelUserWorkspaceInvitationSchema } from '../schemas/workspaceUserInvitationSchemas.ts'
import { WorkspaceUserInvitationRepository } from '../repositories/WorkspaceUserInvitationRepository.ts'

export const cancelUserWorkspaceInvitation = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!
    const validation = cancelUserWorkspaceInvitationSchema.safeParse(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceUserInvitationId } = validation.data

    const workspaceUserInvitation = await WorkspaceUserInvitationRepository.find(workspaceUserInvitationId, workspace.id)

    if (!workspaceUserInvitation) {
        return ResponseHandler.notFound(req, res)
    }

    if (workspaceUserInvitation.email !== user.email) {
        return ResponseHandler.forbidden(req, res)
    }

    const isPending = workspaceUserInvitation.status === WorkspaceUserInvitationRepository.STATUS.PENDING

    if (!isPending) {
        return ResponseHandler.validationError(req, res, {
            workspaceUserInvitationId: 'INVITATION_NOT_PENDING',
        })
    }

    const updatedInvitation = await WorkspaceUserInvitationRepository.cancelInvitation(workspaceUserInvitationId)
   
    ResponseHandler.json(res, {
        invitation: updatedInvitation
    })
}
