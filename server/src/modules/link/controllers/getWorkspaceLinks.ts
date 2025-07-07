import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { LinkRepository } from '../repositories/LinkRepository.ts'

export const getWorkspaceLinks = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const links = await LinkRepository.findManyByWorkspaceId(workspace.id)

    return ResponseHandler.json(res, {
        links
    })
} 