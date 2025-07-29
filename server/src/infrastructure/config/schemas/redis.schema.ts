import { portSchema } from '@/shared/schemas/network.schemas.ts'
import { z } from 'zod'

export const redisSchema = z.object({
    host: z.string(),
    port: portSchema,
    db: z.coerce.number().int().optional(),
    password: z.string().optional(),
    username: z.string().optional(),
})