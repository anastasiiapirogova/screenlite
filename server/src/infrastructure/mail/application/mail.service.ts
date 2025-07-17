import { MailConfigManager } from './mail-config.manager.ts'
import { MailerFactory } from '../../../infrastructure/mail/adapters/mailer.factory.ts'
import { MailerInterface } from '@/core/ports/mailer.interface.ts'
import { EmailOptions } from '@/core/ports/mail-options.interface.ts'
import { VerificationEmailTemplate } from '../../../infrastructure/mail/templates/verification.template.ts'
import { MailServiceInterface, VerificationEmailData } from '@/core/ports/mail.interface.ts'
import { MailConfig } from '../dto/mail-config.dto.ts'

export class MailService implements MailServiceInterface {
    constructor(
        private readonly configManager: MailConfigManager,
        private readonly frontendUrl: string
    ) {}

    async sendEmail(options: EmailOptions): Promise<boolean> {
        const adapter = await this.getCurrentAdapter()

        return adapter?.sendEmail(options) ?? false
    }

    async sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
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

    private async getCurrentAdapter(): Promise<MailerInterface> {
        const config = await this.configManager.getCurrentConfig()

        return MailerFactory.create(config)
    }
}