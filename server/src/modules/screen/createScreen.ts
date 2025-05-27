import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from './policies/screenPolicy.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { ScreenRepository } from './repositories/ScreenRepository.js'
import { createScreenSchema } from './schemas/screenSchemas.js'

export const createScreen = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createScreenSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, name, type } = validation.data

    const workspace = await WorkspaceRepository.getWithMember(workspaceId, user.id)

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await screenPolicy.canCreateScreens(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const newScreen = await ScreenRepository.create({
        name,
        type,
        workspaceId: workspace.id
    })

    ResponseHandler.created(res, {
        screen: newScreen
    })
}