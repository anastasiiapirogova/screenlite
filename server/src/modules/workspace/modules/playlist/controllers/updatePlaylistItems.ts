import { Request, Response } from 'express'
import { updatePlaylistItemsSchema } from '../schemas/playlistItemSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { addRecalculatePlaylistSizeJob } from '../utils/addPlaylistItemsUpdatedJob.ts'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.ts'
import { UpdatePlaylistItemsService } from '../services/UpdatePlaylistItemsService.ts'

export const updatePlaylistItems = async (req: Request, res: Response) => {
    const { playlistId: playlistIdParam } = req.params
    const { items: bodyItems } = req.body

    const validation = await updatePlaylistItemsSchema.safeParseAsync({
        playlistId: playlistIdParam,
        items: bodyItems
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, items } = validation.data

    const playlist = await PlaylistRepository.getWithItems(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    const currentItems = UpdatePlaylistItemsService.mapToComparable(playlist.items)

    const submittedItems = PlaylistRepository.orderItems(items)

    const {
        itemsToDelete,
        itemsToCreate,
        itemsToUpdate,
        itemsCount
    } = await UpdatePlaylistItemsService.processItems({
        currentItems,
        submittedItems,
        workspaceId: playlist.workspaceId
    })

    if (itemsCount === 0) {
        return ResponseHandler.json(res, {
            items: playlist.items
        })
    }

    const result = await PlaylistRepository.updateItems(playlistId, itemsToDelete, itemsToCreate, itemsToUpdate)

    addRecalculatePlaylistSizeJob(playlistId)

    if(playlist.isPublished) {
        addPlaylistUpdatedJob({ playlistId })
    }

    ResponseHandler.json(res, {
        items: PlaylistRepository.orderItems(result.items)
    })
}