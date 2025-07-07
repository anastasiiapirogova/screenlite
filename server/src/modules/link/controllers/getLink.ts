import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { LinkRepository } from '../repositories/LinkRepository.ts'

export const getLink = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { linkId } = req.params

    const link = await LinkRepository.getLink(linkId)

    if (!link || link.workspaceId !== workspace.id) {
        return ResponseHandler.notFound(req, res)
    }

    return ResponseHandler.json(res, {
        link
    })
} 