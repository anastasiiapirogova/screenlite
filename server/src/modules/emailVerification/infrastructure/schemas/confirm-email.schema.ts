import z from 'zod'

export const ConfirmEmailSchema = z.object({
    token: z.string(),
})

export type ConfirmEmailDTO = z.infer<typeof ConfirmEmailSchema>