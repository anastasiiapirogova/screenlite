import { z } from 'zod'

export const secretsSchema = z.object({
    cryptoSecret: z.string().min(1),
})