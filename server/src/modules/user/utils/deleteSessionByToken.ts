import { prisma } from '@config/prisma.js'

export const deleteSessionByToken = async (token: string) => {
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