import { JobRegistry } from './job-queue.interface.ts'
import { SendEmailDTO } from '../dto/send-email.dto.ts'
import { SendVerificationEmailDTO } from '../dto/send-verification-email.dto.ts'

export interface AppJobRegistry extends JobRegistry {
    send_email: {
        data: SendEmailDTO
    }
    send_verification_email: {
        data: SendVerificationEmailDTO
    }
}