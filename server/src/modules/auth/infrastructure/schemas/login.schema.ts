import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email(),
    // strip password to 256 characters to avoid DoS
    password: z.string().min(1).transform(val => val.slice(0, 256))
})