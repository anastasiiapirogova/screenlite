import { MailerInterface } from '@/core/ports/mailer.interface.ts'
import { SMTPMailAdapter } from './smtp.adapter.ts'
import { LogMailAdapter } from './log.adapter.ts'
import { MailConfig } from '../dto/mail-config.dto.ts'

export class MailerFactory {   
    static create(config: MailConfig): MailerInterface {
        switch (config.adapter) {
            case 'smtp':
                if (!config.smtp) {
                    console.warn('Missing SMTP config, using log adapter')
                    return new LogMailAdapter()
                }
                return new SMTPMailAdapter(config.smtp)
            case 'log':
            default:
                return new LogMailAdapter()
        }
    }
}