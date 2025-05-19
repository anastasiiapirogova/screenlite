import { prisma } from '@config/prisma.js'

export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
    })
}