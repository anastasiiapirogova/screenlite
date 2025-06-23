import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'
import { deleteWorkspaceSchema } from '../schemas/workspaceSchemas.js'

export const deleteWorkspace = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { confirmationCode } = req.body
    const workspaceId = workspace.id
    
    const parseResult = deleteWorkspaceSchema.safeParse(req.body)
    
    if (!parseResult.success) {
        return ResponseHandler.zodError(req, res, parseResult.error.errors)
    }
    
    const expectedCode = `${workspaceId.slice(0, 3)}${workspaceId.slice(-3)}`.toUpperCase()

    if (confirmationCode !== expectedCode) {
        return ResponseHandler.validationError(req, res, {
            confirmationCode: 'INVALID_CONFIRMATION_CODE'
        })
    }

    await WorkspaceRepository.softDelete(workspaceId)

    return ResponseHandler.ok(res)
}
