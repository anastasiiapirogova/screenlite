import { PasswordResetTokenDTO } from '../dto/password-reset-token.dto.ts'
import { PasswordResetToken } from '../entities/password-reset-token.entity.ts'

export interface IPasswordResetTokenMapper {
    toDTO(entity: PasswordResetToken): PasswordResetTokenDTO
}