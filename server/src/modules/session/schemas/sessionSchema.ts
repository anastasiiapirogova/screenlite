import { z } from 'zod'

export const terminateSessionSchema = z.object({
    sessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.')
})

export const terminateAllSessionsSchema = z.object({
    userId: z.string().uuid('Invalid userId format. It must be a valid UUID.'),
    excludeSessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.').optional(),
})