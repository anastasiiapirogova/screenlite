import { Socket } from 'socket.io'
import { prisma } from '@/config/prisma.js'
import { DeviceData } from '../types.js'
import { storeDeviceTelemetry } from './storeDeviceTelemetry.js'
import { DeviceRepository } from '../repositories/DeviceRepository.js'

const generateUniqueConnectionCode = async (): Promise<string> => {
    const connectionCode = await DeviceRepository.generateConnectionCode()

    const existingDevice = await prisma.device.findUnique({
        where: { connectionCode },
        select: { id: true }
    })

    if (existingDevice) {
        return generateUniqueConnectionCode()
    }

    return connectionCode
}

export const initNewDevice = async (data: DeviceData, socket: Socket) => {
    const connectionCode = await generateUniqueConnectionCode()

    const token = DeviceRepository.generateDeviceToken()

    const device = await prisma.device.create({
        data: {
            token,
            connectionCode,
        },
        include: {
            screen: true
        }
    })

    storeDeviceTelemetry(token, data, socket)

    return device
}
