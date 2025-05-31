import { prisma } from '@config/prisma.js'
import { generateOpaqueToken } from '@modules/user/utils/generateOpaqueToken.js'
import { Prisma } from 'generated/prisma/client.js'
import { lookup } from 'ip-location-api'

export class SessionRepository {
    static async createSession(userId: string, userAgent: string, ipAddress: string) {
        const token = generateOpaqueToken()

        const locationResult = await lookup(ipAddress)

        const location = locationResult && locationResult.city ? `${locationResult.city}, ${locationResult.country_name}` : null

        const session = await prisma.session.create({
            data: {
                userId,
                token,
                userAgent,
                ipAddress,
                location: location || Prisma.skip
            },
        })

        return session
    }

    static async getSessionData(token: string) {
        const session = await prisma.session.findFirst({
            where: {
                token,
                revokedAt: null
            },
            select: {
                id: true,
                userId: true,
                totpVerifiedAt: true
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

    static async revokeSessionByToken(token: string) {
        const session = await prisma.session.findUnique({
            where: {
                token,
            },
        })

        if (!session) {
            return true
        }

        await prisma.session.update({
            where: {
                token,
            },
            data: {
                revokedAt: new Date(),
            },
        })

        return true
    } 
}