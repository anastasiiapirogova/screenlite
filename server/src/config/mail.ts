import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

export type MailConfig = SMTPTransport.Options & {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    from: string
}

export const getMailConfig = (): MailConfig => {
    return {
        host: process.env.SMTP_HOST || 'localhost',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASSWORD || '',
        },
        from: process.env.MAIL_FROM || 'noreply@screenlite.org',
    }
}

export const createTransporter = () => {
    const config = getMailConfig()

    return nodemailer.createTransport(config)
}

export const getMailProviderType = (): 'smtp' | 'log' => {
    const config = getMailConfig()
    
    const hasSmtpConfig = config.host && 
                         config.host !== 'localhost' && 
                         config.auth.user && 
                         config.auth.pass
    
    return hasSmtpConfig ? 'smtp' : 'log'
} 