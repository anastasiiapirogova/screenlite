import { PasswordResetEmailDTO } from '@/core/dto/password-reset-email.dto.ts'

export class PasswordResetEmailTemplate {
    static getSubject(): string {
        return 'Reset Your Password - Screenlite'
    }

    static getHtml(data: PasswordResetEmailDTO, frontendUrl: string): string {
        const { token, email } = data
        const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${email}`
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p>You requested to reset your password. Click the button below to create a new password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
        `
    }

    static getText(data: PasswordResetEmailDTO, frontendUrl: string): string {
        const { token, email } = data
        const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${email}`
        
        return `
            Reset Your Password
            
            You requested to reset your password. Please visit the following link to create a new password:
            
            ${resetUrl}
            
            This link will expire in 1 hour.
            
            If you didn't request a password reset, you can safely ignore this email.
        `
    }
} 