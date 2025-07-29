import { z } from 'zod'

export const UpdateMailSettingsSchema = z.object({
    adapter: z.enum(['log', 'smtp']).optional()
})