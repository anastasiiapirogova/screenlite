import nodemailer from 'nodemailer'
import { MailerInterface } from '@/core/ports/mailer.interface.ts'
import { MailOptions } from 'nodemailer/lib/smtp-transport/index.js'
import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'
import { EmailOptions } from '@/core/ports/mail-options.interface.ts'

export class SMTPMailAdapter implements MailerInterface {
    private transporter: nodemailer.Transporter
    private fromName: string
    private fromEmail: string

    constructor(settings: SMTPSettings) {
        this.transporter = nodemailer.createTransport({
            host: settings.host,
            port: settings.port,
            secure: settings.secure,
            auth: {
                user: settings.username,
                pass: settings.password,
            },
        })
        this.fromName = settings.senderName
        this.fromEmail = settings.senderEmail
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions: MailOptions = {
                from: this.fromName ? {
                    name: this.fromName,
                    address: this.fromEmail,
                } : this.fromEmail,
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