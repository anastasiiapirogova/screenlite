import { z } from 'zod'

export const secretsSchema = z.object({
    encryptionSecret: z.string().min(44).max(44),
})