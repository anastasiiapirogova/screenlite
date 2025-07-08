import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { createWorkspaceSchema } from '../schemas/workspaceSchemas.ts'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.ts'

export const createWorkspace = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createWorkspaceSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, slug } = validation.data

    const workspace = await WorkspaceRepository.create(name, slug, user.id)

    return ResponseHandler.created(res, {
        workspace
    })
}