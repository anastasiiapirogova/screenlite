import z from 'zod'

export const RequestEmailChangeSchema = z.object({
    userId: z.uuid(),
    newEmail: z.email(),
})

export type RequestEmailChangeDTO = z.infer<typeof RequestEmailChangeSchema>