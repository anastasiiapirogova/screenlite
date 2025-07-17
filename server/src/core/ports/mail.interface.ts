import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'
import { EmailOptions } from './mail-options.interface.ts'

export type VerificationEmailData = {
    email: string
    token: string
}

export type MailServiceInterface = {
    sendEmail(options: EmailOptions): Promise<boolean>
    sendVerificationEmail(data: VerificationEmailData): Promise<boolean>
    testMailConfig(config: MailConfig): Promise<boolean>
}