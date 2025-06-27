import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.ts'
import { updateWorkspaceSchema, workspacePictureSchema } from '../schemas/workspaceSchemas.ts'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.ts'
import { StorageHelper } from '@/services/StorageHelper.ts'

export const updateWorkspace = async (req: Request, res: Response) => {
    const { name, slug, workspaceId } = req.body
    const picture = req.file
    const workspace = req.workspace!

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

        const path = `workspaces/${workspaceId}/picture.jpg`

        try {
            await StorageHelper.uploadAndProcessImage(path, picture.buffer, {
                width: 514,
                height: 514,
                format: 'webp'
            })
            result.picture = path
        } catch {
            return ResponseHandler.validationError(req, res, { picture: 'PICTURE_UPLOAD_FAILED' })
        }
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
        }
    })
}
