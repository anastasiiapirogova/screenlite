import { Socket } from 'socket.io'
import { getIpFromSocket } from '../helpers/getIpFromSocket.js'
import { DeviceData } from '../types.js'
import { prisma } from '@config/prisma.js'
export const storeDeviceTelemetry = async (token: string, data: DeviceData, socket: Socket) => {
    const publicIp = getIpFromSocket(socket)

    await prisma.deviceTelemetry.create({
        data: {
            localIpAddress: data.localIpAddress,
            publicIpAddress: publicIp,
            macAddress: data.macAddress,
            softwareVersion: data.softwareVersion,
            screenResolutionWidth: data.screenResolutionWidth,
            screenResolutionHeight: data.screenResolutionHeight,
            platform: data.platform,
            hostname: data.hostname,
            timezone: data.timezone,
            totalMemory: data.totalMemory,
            freeMemory: data.freeMemory,
            osRelease: data.osRelease,
            device: {
                connect: {
                    token
                }
            }
        }
    })

    return { token }
}