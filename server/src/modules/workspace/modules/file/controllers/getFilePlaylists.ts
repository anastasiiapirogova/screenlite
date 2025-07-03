import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FileRepository } from '../repositories/FileRepository.ts'
import { getFilePlaylistsSchema } from '../schemas/fileSchemas.ts'

export const getFilePlaylists = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await getFilePlaylistsSchema.safeParseAsync(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileId } = validation.data

    const file = await FileRepository.findById(fileId, workspace.id)

    if (!file) {
        return ResponseHandler.notFound(req, res)
    }

    const playlists = await FileRepository.findPlaylistsByFileId(file.id)

    return ResponseHandler.json(res, {
        playlists,
    })
}
