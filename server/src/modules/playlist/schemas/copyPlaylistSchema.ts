import { z } from 'zod'

export const copyPlaylistSchema = z.object({
    playlistId: z.string(),
})