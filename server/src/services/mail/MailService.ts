import nodemailer from 'nodemailer'
import { createTransporter, getMailConfig } from '@/config/mail.ts'
import { error } from '@/utils/logger.ts'
import { 
    VerificationEmailTemplate, 
    WorkspaceInvitationEmailTemplate, 
    PasswordResetEmailTemplate, 
    type VerificationEmailData,
    type WorkspaceInvitationEmailData,
    type PasswordResetEmailData,
} from './templates/index.ts'

export interface EmailOptions {
    to: string
    subject: string
    html: string
    text?: string
    from?: string
    fromName?: string
}

export class MailService {
    private static instance: MailService
    private transporter: nodemailer.Transporter
    private frontendUrl: string

    private constructor(frontendUrl: string) {
        this.transporter = createTransporter()
        this.frontendUrl = frontendUrl
    }

    static getInstance(): MailService {
        if (!MailService.instance) {
            MailService.instance = new MailService(process.env.FRONTEND_URL || 'http://localhost:3002')
        }
        return MailService.instance
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const config = getMailConfig()
            const fromEmail = options.from || config.from
            const fromName = options.fromName || config.fromName || 'Screenlite'
            const formattedFrom = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail

            const mailOptions = {
                from: formattedFrom,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            }

            await this.transporter.sendMail(mailOptions)
            
            return true
        } catch (err) {
            error('Failed to send email', err, { category: 'mail' })
            return false
        }
    }

    async sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
        return this.sendEmail({
            to: data.email,
            subject: VerificationEmailTemplate.getSubject(),
            html: VerificationEmailTemplate.getHtml(data, this.frontendUrl),
            text: VerificationEmailTemplate.getText(data, this.frontendUrl),
        })
    }

    async sendWorkspaceInvitationEmail(data: WorkspaceInvitationEmailData): Promise<boolean> {
        return this.sendEmail({
            to: data.email,
            subject: WorkspaceInvitationEmailTemplate.getSubject(data),
            html: WorkspaceInvitationEmailTemplate.getHtml(data, this.frontendUrl),
            text: WorkspaceInvitationEmailTemplate.getText(data, this.frontendUrl),
        })
    }

    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
        return this.sendEmail({
            to: data.email,
            subject: PasswordResetEmailTemplate.getSubject(),
            html: PasswordResetEmailTemplate.getHtml(data, this.frontendUrl),
            text: PasswordResetEmailTemplate.getText(data, this.frontendUrl),
        })
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify()
            return true
        } catch (err) {
            error('Mail service connection verification failed', err, { category: 'mail' })
            return false
        }
    }
} 