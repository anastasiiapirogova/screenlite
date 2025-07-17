import { MailerInterface } from '@/core/ports/mailer.interface.ts'
import { EmailOptions } from '@/core/ports/mail-options.interface.ts'

export class LogMailAdapter implements MailerInterface {
    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const textContent = options.text || this.extractTextFromHtml(options.html)
            
            console.log(`Email sent (logged): ${options.subject} to ${options.to}`)
            console.log(`Email content: ${textContent}`)
            
            return true
        } catch (err) {
            console.error(`Failed to log email: ${err}`)
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