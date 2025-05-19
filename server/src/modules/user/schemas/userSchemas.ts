import { z } from 'zod'
import { passwordZodSchema } from './passwordSchema.js'

export const changePasswordSchema = z.object({
    userId: z.string().uuid('Invalid userId format. It must be a valid UUID.'),
    currentPassword: z.string(),
    newPassword: passwordZodSchema
})