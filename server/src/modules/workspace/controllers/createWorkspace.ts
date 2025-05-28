import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { createWorkspaceSchema } from '../schemas/workspaceSchemas.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'

export const createWorkspace = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createWorkspaceSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, slug } = validation.data

    const workspace = await WorkspaceRepository.create(name, slug, user.id)

    ResponseHandler.created(res, {
        workspace,
    })
}