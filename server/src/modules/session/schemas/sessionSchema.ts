import { paginationSchema } from 'schemas/paginationSchema.js'
import { z } from 'zod'

export const revokeSessionSchema = z.object({
    sessionId: z.string().uuid('Invalid sessionId format. It must be a valid UUID.')
})

export const userSessionsSchema = paginationSchema.extend({
    search: z.string().optional(),
    status: z.enum(['active', 'revoked']).optional(),
})