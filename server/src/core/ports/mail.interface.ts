import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'
import { SendEmailDTO } from '@/core/dto/send-email.dto.ts'
import { SendVerificationEmailDTO } from '@/core/dto/send-verification-email.dto.ts'

export type IMailService = {
    sendEmail(options: SendEmailDTO): Promise<boolean>
    sendVerificationEmail(data: SendVerificationEmailDTO): Promise<boolean>
    testMailConfig(config: MailConfig): Promise<boolean>
}