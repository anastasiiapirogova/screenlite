import { paginationSchema } from '@/schemas/paginationSchema.js'
import { z } from 'zod'
import { PlaylistStatus } from '../types.js'

const playlistIdSchema = z.string().nonempty('PLAYLIST_ID_IS_REQUIRED')
const screenIdsSchema = z.array(z.string()).nonempty('SCREEN_IDS_ARE_REQUIRED')

const playlistNameSchema = z
    .string({
        invalid_type_error: 'PLAYLIST_NAME_IS_INVALID',
    })
    .nonempty('PLAYLIST_NAME_IS_REQUIRED')

export const copyPlaylistSchema = z.object({
    playlistId: playlistIdSchema,
})

export const deletePlaylistsSchema = z.object({
    playlistIds: z.array(z.string()).nonempty('PLAYLIST_IDS_ARE_REQUIRED'),
})

const playlistTypeSchema = z.enum(
    ['standard', 'nestable'], 
    {
        invalid_type_error: 'PLAYLIST_TYPE_IS_INVALID',
        required_error: 'PLAYLIST_TYPE_IS_REQUIRED',
    }
)

export const newPlaylistSchema = z.object({
    name: playlistNameSchema,
    workspaceId: z.string().nonempty('WORKSPACE_ID_IS_REQUIRED'),
    type: playlistTypeSchema
})

export const addScreensToPlaylistSchema = z.object({
    playlistId: playlistIdSchema,
    screenIds: screenIdsSchema
})

export const removeScreensFromPlaylistSchema = z.object({
    playlistId: playlistIdSchema,
    screenIds: screenIdsSchema
})

export const updatePlaylistSchema = z.object({
    playlistId: playlistIdSchema,
    name: playlistNameSchema.optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional(),
    priority: z.number().int().nonnegative().max(1000000).optional(),
})

export const updatePlaylistPlaylistLayoutSchema = z.object({
    playlistId: playlistIdSchema,
    playlistLayoutId: z.string().nonempty('PLAYLIST_LAYOUT_ID_IS_REQUIRED'),
})

export const getWorkspacePlaylistsSchema = paginationSchema.extend({
    search: z.string().optional(),
    status: z.array(z.nativeEnum(PlaylistStatus)).optional(),
    type: z.array(z.enum(['standard', 'nestable'])).optional(),
    has_screens: z.array(z.enum(['true', 'false'])).optional(),
    has_content: z.array(z.enum(['true', 'false'])).optional(),
    deleted: z.boolean().optional(),
})

export const restorePlaylistsSchema = z.object({
    playlistIds: z.array(z.string().nonempty('PLAYLIST_ID_IS_REQUIRED')),
})