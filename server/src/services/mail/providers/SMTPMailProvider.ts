import nodemailer from 'nodemailer'
import { MailProviderInterface } from './MailProviderInterface.ts'
import { EmailOptions } from '../MailService.ts'
import { createTransporter, getMailConfig } from '@/config/mail.ts'
import { error } from '@/utils/logger.ts'
import { MailOptions } from 'nodemailer/lib/smtp-transport/index.js'

export class SMTPMailProvider implements MailProviderInterface {
    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = createTransporter()
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const config = getMailConfig()
            const fromEmail = options.from || config.from
            const fromName = config.name || 'Screenlite'

            const mailOptions: MailOptions = {
                from: {
                    name: fromName,
                    address: fromEmail,
                },
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            }

            await this.transporter.sendMail(mailOptions)
            
            return true
        } catch (err) {
            error('Failed to send email via SMTP', err, { category: 'mail' })
            return false
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify()
            return true
        } catch (err) {
            error('SMTP connection verification failed', err, { category: 'mail' })
            return false
        }
    }
} 