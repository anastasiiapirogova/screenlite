import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { updateLinkSchema } from '../schemas/linkSchemas.ts'
import { LinkRepository } from '../repositories/LinkRepository.ts'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.ts'

export const updateLink = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await updateLinkSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { linkId, ...updateData } = validation.data

    const link = await LinkRepository.getLinkWithoutRelationsById(linkId)

    if (!link || link.workspaceId !== workspace.id) {
        return ResponseHandler.notFound(req, res)
    }

    if (link.deletedAt) {
        return ResponseHandler.notFound(req, res)
    }

    try {
        const cleanedData = removeUndefinedFromObject(updateData)

        if (Object.keys(cleanedData).length === 0) {
            const updatedLink = await LinkRepository.getLink(linkId)

            return ResponseHandler.json(res, {
                link: updatedLink
            })
        }

        await LinkRepository.update(linkId, cleanedData)

        const updatedLink = await LinkRepository.getLink(linkId)

        return ResponseHandler.json(res, {
            link: updatedLink
        })
    } catch (error) {
        console.error('Error updating link:', error)
        return ResponseHandler.serverError(req, res)
    }
} 