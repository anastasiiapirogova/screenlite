import { SendEmailDTO } from '@/shared/dto/send-email.dto.ts'
import { VerificationEmailDTO } from '@/shared/dto/verification-email.dto.ts'
import { PasswordResetEmailDTO } from '@/shared/dto/password-reset-email.dto.ts'
import { DeleteProfilePhotoDTO } from '@/shared/dto/delete-profile-photo.dto.ts'

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
    delete_old_profile_photo: {
        data: DeleteProfilePhotoDTO
    }
}