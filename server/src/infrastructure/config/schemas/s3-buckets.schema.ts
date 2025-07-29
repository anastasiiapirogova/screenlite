import { z } from 'zod'

export const s3BucketsSchema = z.object({
    userUploads: z.string().min(1),
})