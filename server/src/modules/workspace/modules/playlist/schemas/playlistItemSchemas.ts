import { z } from 'zod'
import { PlaylistItemRepository } from '../repositories/PlaylistItemRepository.ts'

export const playlistItemTypeSchema = z.enum(
    [
        PlaylistItemRepository.TYPE.FILE,
        PlaylistItemRepository.TYPE.NESTED_PLAYLIST,
    ]
)

export const playlistItemSchema = z.object({
    id: z.string(),
    type: playlistItemTypeSchema,
    duration: z.number().nullable(),
    playlistLayoutSectionId: z.string(),
    order: z.number(),
    fileId: z.string().nullable(),
    nestedPlaylistId: z.string().nullable(),
}).refine(data => data.fileId !== null || data.nestedPlaylistId !== null, {
    message: 'Either fileId or nestedPlaylistId must be provided',
}).refine(data => !(data.fileId !== null && data.nestedPlaylistId !== null), {
    message: 'Both fileId and nestedPlaylistId cannot be provided',
})

export const updatePlaylistItemsSchema = z.object({
    playlistId: z.string(),
    items: z.array(playlistItemSchema),
})