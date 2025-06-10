import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { removeUndefinedFromObject } from '@utils/removeUndefinedFromObject.js'
import { updateWorkspaceSchema, workspacePictureSchema } from '../schemas/workspaceSchemas.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'
import { uploadWorkspacePictureToS3 } from '../utils/uploadWorkspacePictureToS3.js'
import { WorkspacePermissionService } from '../services/WorkspacePermissionService.js'
import { WORKSPACE_PERMISSIONS } from '../constants/permissions.js'

export const updateWorkspace = async (req: Request, res: Response) => {
    const { name, slug, workspaceId } = req.body
    const picture = req.file
    const workspace = req.workspace!

    if (!WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE)) {
        return ResponseHandler.forbidden(res)
    }

    const updatedWorkspaceData = {
        name: name !== workspace.name ? name : undefined,
        slug: slug !== workspace.slug ? slug : undefined,
        picture: undefined,
    }

    const parseResult = await updateWorkspaceSchema.safeParseAsync(updatedWorkspaceData)
    
    if (!parseResult.success) {
        return ResponseHandler.zodError(req, res, parseResult.error.errors)
    }

    const result = parseResult.data

    if (picture) {
        const pictureParseResult = workspacePictureSchema.safeParse({ picture })
        
        if (!pictureParseResult.success) {
            return ResponseHandler.zodError(req, res, pictureParseResult.error.errors)
        }

        const picturePath = await uploadWorkspacePictureToS3(workspaceId, picture)

        if (!picturePath) {
            return ResponseHandler.validationError(req, res, { picture: 'PICTURE_UPLOAD_FAILED' })
        }

        result.picture = picturePath
    }

    const data = removeUndefinedFromObject(result)
    
    if (Object.keys(data).length === 0) {
        return ResponseHandler.json(res, {
            workspace,
        })
    }

    const updatedWorkspace = await WorkspaceRepository.update(workspaceId, data)

    return ResponseHandler.json(res, {
        workspace: {
            ...updatedWorkspace,
            role: workspace.role,
            permissions: workspace.permissions,
        }
    })
}
