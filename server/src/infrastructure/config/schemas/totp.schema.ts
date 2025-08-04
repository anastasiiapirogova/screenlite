import { z } from 'zod'

export const totpSchema = z.object({
    algorithm: z.string().min(1),
    digits: z.number().min(6).max(8),
    period: z.number().min(15).max(300),
})