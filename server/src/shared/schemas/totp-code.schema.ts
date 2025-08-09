import { z } from 'zod'

export const totpCodeSchema = z.string().min(6, 'TOTP_CODE_MUST_BE_MIN_6_CHARACTERS').max(20, 'TOTP_CODE_MUST_BE_MAX_20_CHARACTERS')