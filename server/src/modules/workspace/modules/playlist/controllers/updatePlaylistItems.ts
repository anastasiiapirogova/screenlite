import { Request, Response } from 'express'
import { updatePlaylistItemsSchema } from '../schemas/playlistItemSchemas.ts'
import { mapPlaylistItemsToComparable } from '../utils/mapPlaylistItemsToComparable.ts'
import { processPlaylistItemsToCreate } from '../utils/processPlaylistItemsToCreate.ts'
import { fixOrderOfPlaylistItems } from '../utils/fixOrderOfPlaylistItems.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { processPlaylistItems } from '../utils/processPlaylistItems.ts'
import { PlaylistRepository } from '../repositories/PlaylistRepository.ts'
import { addPlaylistItemsUpdatedJob } from '../utils/addPlaylistItemsUpdatedJob.ts'

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