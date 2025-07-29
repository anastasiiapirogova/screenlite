import { portSchema } from '@/shared/schemas/network.schemas.ts'
import { z } from 'zod'

export const s3Schema = z.object({
    port: portSchema,
    region: z.string(),
    accessKey: z.string(),
    secretAccessKey: z.string(),
    endpoint: z.string(),
})