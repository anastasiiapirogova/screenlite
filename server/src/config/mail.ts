import nodemailer from 'nodemailer'

export type MailConfig = {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    from: string
    fromName?: string
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
        fromName: process.env.MAIL_FROM_NAME || 'Screenlite',
    }
}

export const createTransporter = () => {
    const config = getMailConfig()

    return nodemailer.createTransport(config)
} 