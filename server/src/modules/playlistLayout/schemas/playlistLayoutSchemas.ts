import { paginationSchema } from 'schemas/paginationSchema.js'
import { z } from 'zod'

export const updatedPlaylistLayoutSection = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    top: z.coerce.number().int().min(0).max(20000),
    left: z.coerce.number().int().min(0).max(20000),
    width: z.coerce.number().int().min(1).max(20000),
    height: z.coerce.number().int().min(1).max(20000),
    zIndex: z.coerce.number().int().min(0).max(20000),
})

export const nameSchema = z
    .string({
        invalid_type_error: 'PLAYLIST_LAYOUT_NAME_IS_INVALID',
    })
    .nonempty('PLAYLIST_LAYOUT_NAME_IS_REQUIRED')

const workspaceId = z.string().nonempty('WORKSPACE_ID_IS_REQUIRED')

export const createPlaylistLayoutSchema = z.object({
    name: nameSchema,
    workspaceId,
    resolutionWidth: z.coerce.number().int().positive().max(20000),
    resolutionHeight: z.coerce.number().int().positive().max(20000),
})

export const updatePlaylistLayoutSchema = z.object({
    playlistLayoutId: z.string().nonempty(),
    name: nameSchema.optional(),
    resolutionWidth: z.coerce.number().int().positive().max(20000).optional(),
    resolutionHeight: z.coerce.number().int().positive().max(20000).optional(),
    sections: z.array(updatedPlaylistLayoutSection).min(1).optional(),
})

export const deletePlaylistLayoutSchema = z.object({
    playlistLayoutId: z.string().nonempty(),
})

export const getWorkspaceLayoutsSchema = paginationSchema.extend({
    search: z.string().optional(),
})