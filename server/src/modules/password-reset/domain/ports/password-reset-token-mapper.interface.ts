import { PasswordResetTokenDTO } from '../../../../shared/dto/password-reset-token.dto.ts'
import { PasswordResetToken } from '../../../../core/entities/password-reset-token.entity.ts'

export interface IPasswordResetTokenMapper {
    toDTO(entity: PasswordResetToken): PasswordResetTokenDTO
}