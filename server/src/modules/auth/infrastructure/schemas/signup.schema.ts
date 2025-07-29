import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { z } from 'zod'

export const signupSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    password: passwordSchema,
})