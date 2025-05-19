import { z } from 'zod'

export const passwordZodSchema = z
    .string({
        required_error: 'PASSWORD_IS_REQUIRED',
    })
    .min(8, 'PASSWORD_TOO_SHORT')
    .regex(/[\p{Lu}]/u, 'PASSWORD_UPPERCASE_REQUIRED')
    .regex(/[\p{Ll}]/u, 'PASSWORD_LOWERCASE_REQUIRED')
    .regex(/\p{N}/u, 'PASSWORD_NUMBER_REQUIRED')
    .regex(/[^\p{L}\p{N}]/u, 'PASSWORD_SYMBOL_REQUIRED')