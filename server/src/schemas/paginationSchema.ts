import { z } from 'zod'

export const paginationSchema = z.object({
    page: z.preprocess((val) => isNaN(Number(val)) ? 1 : Number(val), z.number().min(1)),
    limit: z.preprocess((val) => isNaN(Number(val)) ? 10 : Number(val), z.number().min(1).max(100)),
})