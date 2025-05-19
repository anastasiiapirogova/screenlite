import crypto from 'crypto'
import { prisma } from '../../../config/prisma.js'
const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString('hex')
}

export const createEmailVerificationToken = async (userId: string, newEmail: string | null) => {
    const token = generateVerificationToken()

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

export const getPendingEmailVerificationToken = async (userId: string) => {
    const pendingToken = await prisma.emailVerificationToken.findFirst({
        where: {
            userId,
        },
    })

    return pendingToken
}

export const checkEmailVerificationToken = async (token: string) => {
    const tokenRecord = await prisma.emailVerificationToken.findUnique({
        where: {
            token,
        },
    })

    if (!tokenRecord) return null

    return tokenRecord
}
