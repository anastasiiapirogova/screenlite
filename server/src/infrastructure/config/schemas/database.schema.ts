import { z } from 'zod'

export const databaseSchema = z.object({
    url: z.url(),
})