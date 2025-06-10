import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'
import { createScreenSchema } from '../schemas/screenSchemas.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'

export const createScreen = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = await createScreenSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, type } = validation.data

    if (!WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.CREATE_SCREENS)) {
        return ResponseHandler.forbidden(res)
    }

    const screen = await ScreenRepository.create({
        name,
        type,
        workspaceId: workspace.id
    })

    ResponseHandler.created(res, {
        screen
    })
}