import { Request, Response } from 'express'
import { updatePlaylistItemsSchema } from '../schemas/playlistItemSchemas.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistItemsUpdateService } from '../services/PlaylistItemUpdateService.ts'
import { addRecalculatePlaylistSizeJob } from '../utils/addRecalculatePlaylistSizeJob.ts'
import { addPlaylistUpdatedJob } from '../utils/addPlaylistUpdatedJob.ts'
import { prisma } from '@/config/prisma.ts'

export const updatePlaylistItems = async (req: Request, res: Response) => {
    const { playlistId } = req.params
    const { items: bodyItems } = req.body

    const validation = await updatePlaylistItemsSchema.safeParseAsync({
        playlistId,
        items: bodyItems
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { items } = validation.data

    const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
            items: true,
            layout: {
                include: {
                    sections: {
                        select: {
                            id: true,
                        }
                    }
                }
            }
        }
    })

    if (!playlist) {
        return ResponseHandler.notFound(req, res)
    }

    const playlistLayoutSectionIds = playlist.layout?.sections.map(section => section.id) || []
    
    const processedItems = await PlaylistItemsUpdateService.processItems(
        playlist.items,
        items,
        playlist.workspaceId,
        playlistLayoutSectionIds
    )

    if (processedItems.itemsCount === 0) {
        return ResponseHandler.json(res, {
            items: playlist.items
        })
    }

    const updatedPlaylist = await PlaylistItemsUpdateService.applyChanges(
        playlistId,
        processedItems
    )

    if (processedItems.itemsToDelete.length > 0 || processedItems.itemsToCreate.length > 0) {
        addRecalculatePlaylistSizeJob(playlistId)
    }
    
    if(playlist.isPublished) {
        addPlaylistUpdatedJob({ playlistId, context: 'playlist items updated' })
    }

    ResponseHandler.json(res, {
        items: updatedPlaylist.items
    })
}