import { EmailVerificationTokenDTO } from '../dto/email-verification-token.dto.ts'
import { EmailVerificationToken } from '../entities/email-verification-token.entity.ts'
import { EmailVerificationTokenType } from '../enums/email-verification-token-type.enum.ts'

export class EmailVerificationTokenMapper {
    static toDTO(entity: EmailVerificationToken): EmailVerificationTokenDTO {
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