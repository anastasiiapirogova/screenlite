import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { userNameSchema } from '@/shared/schemas/user.schemas.ts'
import { z } from 'zod'

export const signupSchema = z.object({
    email: z.email(),
    name: userNameSchema,
    password: passwordSchema,
})