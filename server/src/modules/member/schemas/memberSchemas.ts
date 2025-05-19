import { paginationSchema } from 'schemas/paginationSchema.js'
import { z } from 'zod'

export const workspaceMembersSchema = paginationSchema.extend({
    search: z.string().optional(),
})