import z from 'zod'

export const SendVerificationEmailSchema = z.object({
    userId: z.uuid(),
})

export type SendVerificationEmailDTO = z.infer<typeof SendVerificationEmailSchema>