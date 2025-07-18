import { z } from 'zod'

export const ffmpegSchema = z.object({
    apiUrl: z.url(),
})