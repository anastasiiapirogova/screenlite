import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { exclude } from '../../../utils/exclude.js'
import { playlistPolicy } from '../policies/playlistPolicy.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { copyPlaylistSchema } from '../schemas/copyPlaylistSchema.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'

export const copyPlaylist = async (req: Request, res: Response) => {
    const user = req.user!
    const data = req.body

    const validation = await copyPlaylistSchema.safeParseAsync(data)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId } = validation.data

    const playlist = await PlaylistRepository.getPlaylistToCopy(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await playlistPolicy.canCopyPlaylist(user, playlist)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const newPlaylist = await prisma.playlist.create({
        data: {
            ...exclude(playlist, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'items', 'schedules', 'screens', 'isPublished']),
            isPublished: false,
            screens: {
                create: playlist.screens.map(screen => ({ screenId: screen.screenId }))
            },
            schedules: {
                create: playlist.schedules.map(schedule => ({
                    ...exclude(schedule, ['id', 'createdAt', 'updatedAt', 'playlistId']),
                }))
            },
            items: {
                create: playlist.items.map(item => ({
                    ...exclude(item, ['id', 'createdAt', 'updatedAt', 'playlistId']),
                }))
            },
        },
        include: PlaylistRepository.singularPlaylistIncludeClause
    })

    ResponseHandler.json(res, {
        playlist: exclude(newPlaylist, ['playlistLayoutId'])
    })
}
