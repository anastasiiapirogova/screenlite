import { z } from 'zod'

export const appSchema = z.object({
    frontendUrl: z.url(),
    backendUrl: z.url(),
})
