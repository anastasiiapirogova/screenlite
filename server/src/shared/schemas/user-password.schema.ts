import { z } from 'zod'
import { USER_PASSWORD_RULES } from '../validation/user-password.rules.ts'

export const passwordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .min(USER_PASSWORD_RULES.minLength, 'PASSWORD_TOO_SHORT')
    .max(USER_PASSWORD_RULES.maxLength, 'PASSWORD_TOO_LONG')

export const currentPasswordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .max(USER_PASSWORD_RULES.maxLength, 'PASSWORD_TOO_LONG')