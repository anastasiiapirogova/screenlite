import { EmailVerificationTokenDTO } from '@/shared/dto/email-verification-token.dto.ts'
import { EmailVerificationToken } from '@/core/entities/email-verification-token.entity.ts'
import { EmailVerificationTokenType } from '@/core/enums/email-verification-token-type.enum.ts'
import { IEmailVerificationTokenMapper } from '@/modules/email-verification/domain/ports/email-verification-token-mapper.interface.ts'

export class EmailVerificationTokenMapper implements IEmailVerificationTokenMapper {
    toDTO(entity: EmailVerificationToken): EmailVerificationTokenDTO {
        return {
            id: entity.id,
            userId: entity.userId,
            tokenHash: entity.tokenHash,
            type: entity.type as EmailVerificationTokenType,
            expiresAt: entity.expiresAt,
            newEmail: entity.newEmail,
            createdAt: entity.createdAt,
        }
    }
}