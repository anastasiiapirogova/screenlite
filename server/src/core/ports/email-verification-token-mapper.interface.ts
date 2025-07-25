import { EmailVerificationTokenDTO } from '@/core/dto/email-verification-token.dto.ts'
import { EmailVerificationToken } from '@/generated/prisma/client.ts'

export interface IEmailVerificationTokenMapper {
    toDTO(entity: EmailVerificationToken): EmailVerificationTokenDTO
}