import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'
import { SendEmailDTO } from '@/shared/dto/send-email.dto.ts'
import { VerificationEmailDTO } from '@/shared/dto/verification-email.dto.ts'

export type IMailService = {
    sendEmail(options: SendEmailDTO): Promise<boolean>
    sendVerificationEmail(data: VerificationEmailDTO): Promise<boolean>
    testMailConfig(config: MailConfig): Promise<boolean>
}