import { MailProviderInterface } from './MailProviderInterface.ts'
import { EmailOptions } from '../MailService.ts'
import { info } from '@/utils/logger.ts'

export class LogMailProvider implements MailProviderInterface {
    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const textContent = options.text || this.extractTextFromHtml(options.html)
            
            info(`Email sent (logged): ${options.subject} to ${options.to}`, { category: 'mail' })
            info(`Email content: ${textContent}`, { category: 'mail' })
            
            return true
        } catch (err) {
            info(`Failed to log email: ${err}`, { category: 'mail' })
            return false
        }
    }

    async verifyConnection(): Promise<boolean> {
        return true
    }

    private extractTextFromHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    }
}