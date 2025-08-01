import { passwordSchema } from '@/shared/schemas/user-password.schema.ts'
import { z } from 'zod'

export const changePasswordSchema = z.object({
    // strip current password to 256 characters to avoid DoS
    currentPassword: z.string().min(1).transform(val => val.slice(0, 256)),
    password: passwordSchema
})