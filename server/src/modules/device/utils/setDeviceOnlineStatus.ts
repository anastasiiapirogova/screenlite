import { Prisma } from '@prisma/client'
import { prisma } from '../../../config/prisma.js'

export const setDeviceOnlineStatus = async (token: string, status: boolean, createdAt?: Date) => {
    const device = await prisma.device.findUnique({
        where: { token }
    })

    if (!device) {
        return
    }

    await prisma.device.update({
        where: {
            id: device.id
        },
        data: {
            isOnline: status,
            statusLog: {
                create: {
                    isOnline: status,
                    createdAt: createdAt || Prisma.skip,
                }
            },
        },
    })
}
