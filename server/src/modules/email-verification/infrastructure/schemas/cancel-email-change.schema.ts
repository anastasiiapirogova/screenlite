import z from 'zod'

export const CancelEmailChangeSchema = z.object({
    userId: z.uuid(),
})

export type CancelEmailChangeDTO = z.infer<typeof CancelEmailChangeSchema>