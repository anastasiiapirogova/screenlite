import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'

export const screenPlaylists = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { screenId } = req.params

    const playlists = await ScreenRepository.findPlaylists(screenId, workspace.id)

    return ResponseHandler.json(res, {
        playlists,
    })
}
