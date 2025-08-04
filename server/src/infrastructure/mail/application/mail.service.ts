import { MailConfigManager } from './mail-config.manager.ts'
import { MailerFactory } from '../adapters/mailer.factory.ts'
import { IMailer } from '@/core/ports/mailer.interface.ts'
import { VerificationEmailTemplate } from '../templates/verification.template.ts'
import { IMailService } from '@/core/ports/mail.interface.ts'
import { MailConfig } from '../dto/mail-config.dto.ts'
import { SendEmailDTO } from '@/shared/dto/send-email.dto.ts'
import { VerificationEmailDTO } from '@/shared/dto/verification-email.dto.ts'

export class MailService implements IMailService {
    constructor(
        private readonly configManager: MailConfigManager,
        private readonly frontendUrl: string
    ) {}

    async sendEmail(options: SendEmailDTO): Promise<boolean> {
        const adapter = await this.getCurrentAdapter()

        return adapter?.sendEmail(options) ?? false
    }

    async sendVerificationEmail(data: VerificationEmailDTO): Promise<boolean> {
        return this.sendEmail({
            to: data.email,
            subject: VerificationEmailTemplate.getSubject(),
            html: VerificationEmailTemplate.getHtml(data, this.frontendUrl),
            text: VerificationEmailTemplate.getText(data, this.frontendUrl),
        })
    }

    async testMailConfig(config: MailConfig): Promise<boolean> {
        const adapter = MailerFactory.create(config)

        return adapter.verifyConnection()
    }

    private async getCurrentAdapter(): Promise<IMailer> {
        const config = await this.configManager.getCurrentConfig()

        return MailerFactory.create(config)
    }
}