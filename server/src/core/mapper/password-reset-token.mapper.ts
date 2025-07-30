import { IPasswordResetTokenMapper } from '../ports/password-reset-token-mapper.interface.ts'
import { PasswordResetToken } from '../entities/password-reset-token.entity.ts'
import { PasswordResetTokenDTO } from '../dto/password-reset-token.dto.ts'

export class PasswordResetTokenMapper implements IPasswordResetTokenMapper {
    toDTO(entity: PasswordResetToken): PasswordResetTokenDTO {
        return {
            id: entity.id,
            tokenHash: entity.tokenHash,
            userId: entity.userId,
            expiresAt: entity.expiresAt,
        }
    }
}