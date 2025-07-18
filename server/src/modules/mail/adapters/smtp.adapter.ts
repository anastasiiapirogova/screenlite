import { EmailOptions } from '@/core/ports/mail-options.interface.ts'
import { MailerInterface } from '@/core/ports/mailer.interface.ts'
import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'
import nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/smtp-transport/index.js'

export class SMTPMailAdapter implements MailerInterface {
    private transporter: nodemailer.Transporter

    constructor(settings: SMTPSettings) {
        this.transporter = nodemailer.createTransport({
            host: settings.host,
            port: settings.port,
            secure: settings.secure,
            auth: {
                user: settings.username,
                pass: settings.password,
            },
            from: {
                name: settings.senderName,
                address: settings.senderEmail,
            },
        })
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions: MailOptions = {
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            }

            await this.transporter.sendMail(mailOptions)
            
            return true
        } catch (err) {
            console.log('Failed to send email via SMTP', err, { category: 'mail' })
            return false
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify()
            return true
        } catch (err) {
            console.log('SMTP connection verification failed', err, { category: 'mail' })
            return false
        }
    }
} 