import { Request, Response } from 'express'
import { updatePlaylistItemsSchema } from '../schemas/playlistItemSchemas.js'
import { mapPlaylistItemsToComparable } from '../utils/mapPlaylistItemsToComparable.js'
import { processPlaylistItemsToCreate } from '../utils/processPlaylistItemsToCreate.js'
import { fixOrderOfPlaylistItems } from '../utils/fixOrderOfPlaylistItems.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { processPlaylistItems } from '../utils/processPlaylistItems.js'
import { PlaylistRepository } from '../repositories/PlaylistRepository.js'
import { addPlaylistItemsUpdatedJob } from '../utils/addPlaylistItemsUpdatedJob.js'

export const updatePlaylistItems = async (req: Request, res: Response) => {
    const validation = await updatePlaylistItemsSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { playlistId, items } = validation.data

    const playlist = await PlaylistRepository.getWithItems(playlistId)

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    const currentItems = mapPlaylistItemsToComparable(playlist.items)

    const submittedItems = fixOrderOfPlaylistItems(items)

    const { itemsToDelete, itemsToCreate, itemsToUpdate, itemsCount } = processPlaylistItems(currentItems, submittedItems)

    if (itemsCount === 0) {
        return ResponseHandler.json(res, {
            items: playlist.items
        })
    }

    const processedItemsToCreate = await processPlaylistItemsToCreate(itemsToCreate, playlist.workspaceId)

    const result = await PlaylistRepository.updateItems(playlistId, itemsToDelete, processedItemsToCreate, itemsToUpdate)

    addPlaylistItemsUpdatedJob(playlist.id)

    ResponseHandler.json(res, {
        items: fixOrderOfPlaylistItems(result.items)
    })
}