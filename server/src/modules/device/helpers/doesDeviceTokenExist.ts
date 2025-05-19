import { prisma } from '@config/prisma.js'

export const doesDeviceTokenExist = async (token: string | null): Promise<boolean> => {
    if (!token) {
        return false
    }

    const device = await prisma.device.findUnique({
        where: { token },
    })

    return device !== null
}