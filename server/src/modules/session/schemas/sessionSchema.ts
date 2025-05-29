import { z } from 'zod'

export const revokeSessionSchema = z.object({
    sessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.')
})