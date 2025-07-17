import { portSchema } from '@/shared/schemas/network.schemas.ts'
import { z } from 'zod'

export const redisSchema = z.object({
    host: z.string(),
    port: portSchema,
    password: z.string().optional(),
    db: z.coerce.number().int().optional(),
})