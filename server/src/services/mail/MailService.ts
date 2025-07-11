import { MailProviderInterface } from './providers/MailProviderInterface.ts'
import { SMTPMailProvider } from './providers/SMTPMailProvider.ts'
import { LogMailProvider } from './providers/LogMailProvider.ts'
import { getMailProviderType } from '@/config/mail.ts'
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
    private provider: MailProviderInterface
    private frontendUrl: string

    private constructor() {
        this.provider = this.createProvider()
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002'
    }

    private createProvider(): MailProviderInterface {
        const providerType = getMailProviderType()
        
        switch (providerType) {
            case 'smtp':
                console.log('Screenlite: Mail service initialized with SMTP provider')
                return new SMTPMailProvider()
            case 'log':
                console.log('Screenlite: Mail service initialized with Log provider')
                return new LogMailProvider()
            default:
                throw new Error(`Invalid mail provider type: ${providerType}`)
        }
    }

    static getInstance(): MailService {
        if (!MailService.instance) {
            MailService.instance = new MailService()
        }
        return MailService.instance
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        return this.provider.sendEmail(options)
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
        return this.provider.verifyConnection()
    }
} 