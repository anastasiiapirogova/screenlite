import { prisma } from '@config/prisma.js'
import { generateOpaqueToken } from '@modules/user/utils/generateOpaqueToken.js'
import { exclude } from '@utils/exclude.js'

export class SessionRepository {
    static async createSession(userId: string, userAgent: string, ipAddress: string) {
        const token = generateOpaqueToken()

        const session = await prisma.session.create({
            data: {
                userId,
                token,
                userAgent,
                ipAddress,
            },
        })

        return session
    }

    static async getSessionUser(token: string) {
        const session = await prisma.session.findUnique({
            where: {
                token,
            },
            select: {
                userId: true,
                revokedAt: true,
            },
        })

        if (!session || session.revokedAt) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.userId,
            },
        })

        return user ? exclude(user, ['password']) : null
    }

    static async getUserSessions(userId: string, revoked: boolean = false) {
        return await prisma.session.findMany({
            where: {
                userId,
                revokedAt: revoked ? { not: null } : null,
            },
            orderBy: { lastActivityAt: 'desc' },
        })
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
}