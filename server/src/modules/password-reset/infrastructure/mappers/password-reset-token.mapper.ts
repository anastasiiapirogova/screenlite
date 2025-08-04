import { IPasswordResetTokenMapper } from '@/modules/password-reset/domain/ports/password-reset-token-mapper.interface.ts'
import { PasswordResetToken } from '@/core/entities/password-reset-token.entity.ts'
import { PasswordResetTokenDTO } from '@/shared/dto/password-reset-token.dto.ts'

export class PasswordResetTokenMapper implements IPasswordResetTokenMapper {
    toDTO(entity: PasswordResetToken): PasswordResetTokenDTO {
        return {
            id: entity.id,
            tokenHash: entity.tokenHash,
            userId: entity.userId,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
        }
    }
}