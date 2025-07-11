import { EmailOptions } from '../MailService.ts'

export interface MailProviderInterface {
    sendEmail(options: EmailOptions): Promise<boolean>
    verifyConnection(): Promise<boolean>
} 