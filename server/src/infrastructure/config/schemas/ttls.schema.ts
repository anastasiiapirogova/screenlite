import { z } from 'zod'

export const TTLsSchema = z.object({
    emailVerification: z.number().int().positive().describe('The TTL for email verification in seconds'),
    emailChange: z.number().int().positive().describe('The TTL for email change in seconds'),
    passwordReset: z.number().int().positive().describe('The TTL for password reset in seconds'),
})