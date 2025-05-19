import { prisma } from '@config/prisma.js'

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    })
}