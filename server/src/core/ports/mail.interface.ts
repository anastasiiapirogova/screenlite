import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'
import { SendEmailDTO } from '@/core/dto/send-email.dto.ts'

export type VerificationEmailData = {
    email: string
    token: string
}

export type IMailService = {
    sendEmail(options: SendEmailDTO): Promise<boolean>
    sendVerificationEmail(data: VerificationEmailData): Promise<boolean>
    testMailConfig(config: MailConfig): Promise<boolean>
}