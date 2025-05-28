import { Request, Response } from 'express'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspacePolicy } from '../policies/WorkspacePolicy.js'
import { removeUndefinedFromObject } from '@utils/removeUndefinedFromObject.js'
import { updateWorkspaceSchema, workspaceIdSchema, workspacePictureSchema } from '../schemas/workspaceSchemas.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'
import { uploadWorkspacePictureToS3 } from '../utils/uploadWorkspacePictureToS3.js'

export const updateWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const { name, slug, workspaceId } = req.body
    const picture = req.file

    try {
        workspaceIdSchema.parse(req.body)

        const workspace = await WorkspaceRepository.getWithMember(workspaceId, user.id)

        if (!workspace) {
            return ResponseHandler.notFound(res)
        }

        const allowed = await WorkspacePolicy.canUpdateWorkspace(user, workspace)

        if (!allowed) {
            return ResponseHandler.forbidden(res)
        }

        const updatedWorkspaceData = {
            name: name !== workspace.name ? name : undefined,
            slug: slug !== workspace.slug ? slug : undefined,
            picture: undefined,
        }

        const result = await updateWorkspaceSchema.parseAsync(updatedWorkspaceData)

        if (picture) {
            workspacePictureSchema.parse({ picture })

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
            workspace: updatedWorkspace,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return ResponseHandler.zodError(req, res, error.errors)
        }

        throw error
    }
}
