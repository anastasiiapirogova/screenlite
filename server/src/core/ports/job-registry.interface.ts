import { JobRegistry } from './job-queue.interface.ts'
import { SendEmailDTO } from '../dto/send-email.dto.ts'
import { VerificationEmailDTO } from '../dto/verification-email.dto.ts'

export interface AppJobRegistry extends JobRegistry {
    send_email: {
        data: SendEmailDTO
    }
    send_verification_email: {
        data: VerificationEmailDTO
    }
}