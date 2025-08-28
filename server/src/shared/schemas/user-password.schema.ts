import { z } from 'zod'

const passwordMinLength = 8
const passwordMaxLength = 256

export const passwordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .min(passwordMinLength, `PASSWORD_MUST_BE_AT_LEAST_${passwordMinLength}_CHARACTERS`)
    .max(passwordMaxLength, `PASSWORD_MUST_BE_LESS_THAN_${passwordMaxLength}_CHARACTERS`)

export const currentPasswordSchema = z
    .string()
    .nonempty('PASSWORD_IS_REQUIRED')
    .max(passwordMaxLength, `PASSWORD_MUST_BE_LESS_THAN_${passwordMaxLength}_CHARACTERS`)