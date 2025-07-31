import { z } from 'zod'

export const passwordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .min(8, 'PASSWORD_TOO_SHORT')