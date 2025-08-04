import { SendEmailDTO } from '@/shared/dto/send-email.dto.ts'

export type IMailer = {
    sendEmail(options: SendEmailDTO): Promise<boolean>
    verifyConnection(): Promise<boolean>
}