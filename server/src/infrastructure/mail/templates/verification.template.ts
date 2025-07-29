import { VerificationEmailDTO } from '@/core/dto/verification-email.dto.ts'

export class VerificationEmailTemplate {
    static getSubject(): string {
        return 'Verify Your Email Address - Screenlite'
    }

    static getHtml(data: VerificationEmailDTO, frontendUrl: string): string {
        const { token } = data
        const verificationUrl = `${frontendUrl}/verify-email?token=${token}`
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p>Thank you for signing up! Please click the button below to verify your email address:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Verify Email Address
                </a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
        `
    }

    static getText(data: VerificationEmailDTO, frontendUrl: string): string {
        const { token } = data
        const verificationUrl = `${frontendUrl}/verify-email?token=${token}`
        
        return `
            Verify Your Email Address
            
            Thank you for signing up! Please visit the following link to verify your email address:
            
            ${verificationUrl}
            
            This link will expire in 24 hours.
            
            If you didn't create an account, you can safely ignore this email.
        `
    }
} 