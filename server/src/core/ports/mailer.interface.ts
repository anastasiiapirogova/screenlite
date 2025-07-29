import { SendEmailDTO } from '@/core/dto/send-email.dto.ts'

export type IMailer = {
    sendEmail(options: SendEmailDTO): Promise<boolean>
    verifyConnection(): Promise<boolean>
}