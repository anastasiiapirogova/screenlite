import { SendEmailDTO } from '../dto/send-email.dto.ts'
import { VerificationEmailDTO } from '../dto/verification-email.dto.ts'
import { PasswordResetEmailDTO } from '../dto/password-reset-email.dto.ts'

export interface AppJobRegistry {
    send_email: {
        data: SendEmailDTO
    }
    send_verification_email: {
        data: VerificationEmailDTO
    }
    send_password_reset_email: {
        data: PasswordResetEmailDTO
    }
}