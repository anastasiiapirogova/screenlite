import z from 'zod'

export const ConfirmEmailChangeSchema = z.object({
    token: z.string(),
})

export type ConfirmEmailChangeDTO = z.infer<typeof ConfirmEmailChangeSchema>