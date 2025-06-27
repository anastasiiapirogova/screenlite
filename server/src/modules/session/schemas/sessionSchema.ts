import { paginationSchema } from '@/schemas/paginationSchema.ts'
import { z } from 'zod'

export const terminateSessionSchema = z.object({
    sessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.')
})

export const terminateAllSessionsSchema = z.object({
    userId: z.string().uuid('Invalid userId format. It must be a valid UUID.'),
    excludeSessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.').optional(),
})

export const userSessionsSchema = paginationSchema.extend({
    search: z.string().optional(),
    status: z.enum(['active', 'revoked']).optional(),
})