import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { createLinkSchema } from '../schemas/linkSchemas.ts'
import { LinkRepository } from '../repositories/LinkRepository.ts'

export const createLink = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const user = req.user!

    const validation = await createLinkSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const linkData = validation.data

    const link = await LinkRepository.create({
        ...linkData,
        workspaceId: workspace.id,
        addedById: user.id
    })

    const createdLink = await LinkRepository.getLink(link.id)

    return ResponseHandler.created(res, {
        link: createdLink
    })
} 