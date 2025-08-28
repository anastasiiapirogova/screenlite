import { currentPasswordSchema } from '@/shared/schemas/user-password.schema.ts'
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email(),
    // strip password to 256 characters to avoid DoS
    password: currentPasswordSchema
})