import { prisma } from '@/config/prisma.ts'
import { randomBytes } from 'crypto'

export class PasswordResetTokenRepository {
    static async getPasswordResetToken(): Promise<string> {
        return randomBytes(32).toString('hex')
    }

    static async createPasswordResetToken(userId: string): Promise<{ token: string, expiresAt: Date }> {
        const token = await this.getPasswordResetToken()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await prisma.passwordResetToken.deleteMany({
            where: {
                userId,
            },
        })

        const tokenRecord = await prisma.passwordResetToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        })

        return {
            token: tokenRecord.token,
            expiresAt: tokenRecord.expiresAt,
        }
    }

    static async validatePasswordResetToken(token: string): Promise<{ userId: string, isValid: boolean }> {
        const tokenRecord = await prisma.passwordResetToken.findUnique({
            where: {
                token,
            },
        })

        if (!tokenRecord) {
            return { userId: '', isValid: false }
        }

        if (tokenRecord.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({
                where: {
                    id: tokenRecord.id,
                },
            })
            return { userId: '', isValid: false }
        }

        return {
            userId: tokenRecord.userId,
            isValid: true,
        }
    }

    static async deletePasswordResetToken(token: string): Promise<void> {
        await prisma.passwordResetToken.deleteMany({
            where: {
                token,
            },
        })
    }

    static async deleteUserPasswordResetTokens(userId: string): Promise<void> {
        await prisma.passwordResetToken.deleteMany({
            where: {
                userId,
            },
        })
    }
} 