import { prisma } from '@config/prisma.js'
import { Prisma } from 'generated/prisma/client.js'

export class SessionRepository {
    static async createSession(userId: string, token: string, userAgent: string, ipAddress: string) {
        const session = await prisma.session.create({
            data: {
                userId,
                token,
                userAgent,
                ipAddress
            },
        })

        return session
    }

    static async getSessionData(token: string) {
        const session = await prisma.session.findFirst({
            where: {
                token,
                terminatedAt: null
            },
            select: {
                id: true,
                userId: true,
                twoFaVerifiedAt: true
            },
        })

        if (!session) {
            return null
        }

        await prisma.session.update({
            where: { id: session.id },
            data: { lastActivityAt: new Date() },
        })

        const user = await prisma.user.findUnique({
            where: {
                id: session.userId,
            },
            omit: {
                totpSecret: false
            }
        })

        if(!user) {
            return null
        }

        return {
            user,
            session
        }
    }

    static async getSession(id: string) {
        const session = await prisma.session.findUnique({
            where: {
                id,
            },
        })

        if (!session) {
            return null
        }

        return session
    }

    static async terminateSessionByToken(token: string) {
        const session = await prisma.session.findUnique({
            where: {
                token,
            },
        })

        if (!session || session.terminatedAt) {
            return true
        }

        await prisma.session.update({
            where: {
                token,
            },
            data: {
                terminatedAt: new Date(),
            },
        })

        return true
    }

    static async terminateSessionsByUserId(userId: string, excludeSessionId?: string) {
        const whereClause: Prisma.SessionWhereInput = {
            userId,
            terminatedAt: null,
            ...(excludeSessionId && { id: { not: excludeSessionId } }),
        }

        await prisma.session.updateMany({
            where: whereClause,
            data: {
                terminatedAt: new Date(),
            },
        })
    }

    static async setTwoFaVerified(token: string) {
        await prisma.session.update({
            where: {
                token,
            },
            data: {
                twoFaVerifiedAt: new Date(),
            },
        })
    }

    static async clearTwoFaVerified(userId: string) {
        await prisma.session.updateMany({
            where: {
                userId,
            },
            data: {
                twoFaVerifiedAt: null,
            },
        })
    }
}