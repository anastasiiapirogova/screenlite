import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { playlistPolicy } from '@modules/playlist/policies/playlistPolicy.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'

export const screenPlaylists = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const workspaceId = await ScreenRepository.findWorkspaceId(id)

    if (!workspaceId) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canViewPlaylists(user, workspaceId)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const playlists = await ScreenRepository.findPlaylists(id)

    ResponseHandler.json(res, {
        playlists,
    })
}
