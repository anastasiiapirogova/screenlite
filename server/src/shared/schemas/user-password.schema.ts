import { z } from 'zod'

export const passwordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .min(8, 'PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS')
    .max(256, 'PASSWORD_MUST_BE_LESS_THAN_256_CHARACTERS')