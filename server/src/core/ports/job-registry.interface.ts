import { SendEmailDTO } from '@/shared/dto/send-email.dto.ts'
import { VerificationEmailDTO } from '@/shared/dto/verification-email.dto.ts'
import { PasswordResetEmailDTO } from '@/shared/dto/password-reset-email.dto.ts'
import { DeleteFileFromStorageDTO } from '@/shared/dto/delete-file-from-storage.dto.ts'
import { ChangeEmailConfirmationEmailDTO } from '@/shared/dto/change-email-confirmation-email.dto.ts'

export interface AppJobRegistry {
    send_email: {
        data: SendEmailDTO
    }
    send_verification_email: {
        data: VerificationEmailDTO
    }
    send_email_change_confirmation: {
        data: ChangeEmailConfirmationEmailDTO
    }
    send_password_reset_email: {
        data: PasswordResetEmailDTO
    }
    delete_file_from_storage: {
        data: DeleteFileFromStorageDTO
    }
}