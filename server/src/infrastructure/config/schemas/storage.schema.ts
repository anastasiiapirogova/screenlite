import { z } from 'zod'

export const storageSchema = z.object({
    type: z.enum(['local', 's3']),
})