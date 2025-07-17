import { EmailOptions } from './mail-options.interface.ts'

export type MailerInterface = {
    sendEmail(options: EmailOptions): Promise<boolean>
    verifyConnection(): Promise<boolean>
}