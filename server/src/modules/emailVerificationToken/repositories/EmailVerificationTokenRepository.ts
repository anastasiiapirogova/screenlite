import { prisma } from '@/config/prisma.js'
import { getEmailVerificationToken } from '@/modules/emailVerificationToken/utils/getEmailVerificationToken.js'

export class EmailVerificationTokenRepository {
    static async createEmailVerificationToken(userId: string, newEmail: string | null) {
        const token = getEmailVerificationToken()

        const [, tokenRecord] = await prisma.$transaction([
            prisma.emailVerificationToken.deleteMany({
                where: {
                    userId: userId,
                },
            }),
            prisma.emailVerificationToken.create({
                data: {
                    token,
                    userId,
                    newEmail,
                },
            })
        ])

        return tokenRecord
    }


    static deleteVerificationTokens(userId: string) {
        return prisma.emailVerificationToken.deleteMany({
            where: {
                userId,
            },
        })
    }

    static async getPendingEmailVerificationToken(userId: string) {
        const pendingToken = await prisma.emailVerificationToken.findFirst({
            where: {
                userId,
            },
        })

        return pendingToken
    }

    static async checkEmailVerificationToken(token: string) {
        const tokenRecord = await prisma.emailVerificationToken.findUnique({
            where: {
                token,
            },
        })

        if (!tokenRecord) return null

        return tokenRecord
    }
}