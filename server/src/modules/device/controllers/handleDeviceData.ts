import { Socket } from 'socket.io'
import { z } from 'zod'
import { initNewDevice } from '../utils/initNewDevice.js'
import { storeDeviceTelemetry } from '../utils/storeDeviceTelemetry.js'
import { DeviceRepository } from '../repositories/DeviceRepository.js'

const DeviceDataSchema = z.object({
    token: z.string().nullable(),
    localIpAddress: z.string(),
    macAddress: z.string(),
    softwareVersion: z.string(),
    screenResolutionWidth: z.number(),
    screenResolutionHeight: z.number(),
    platform: z.string(),
    hostname: z.string(),
    timezone: z.string(),
    totalMemory: z.number(),
    freeMemory: z.number(),
    osRelease: z.string()
})

export type DeviceData = z.infer<typeof DeviceDataSchema>;

export const handleDeviceData = async (data: unknown, socket: Socket) => {
    const parsedData = DeviceDataSchema.safeParse(data)

    if (!parsedData.success) {
        socket.emit('error', { handle: 'deviceData', errors: parsedData.error.errors })
        return
    }

    const { token } = parsedData.data

    let response: { token: string }

    if (await DeviceRepository.doesDeviceTokenExist(token)) {
        response = await storeDeviceTelemetry(token!, parsedData.data, socket)
    } else {
        response = await initNewDevice(parsedData.data, socket)
    }

    return { token: response.token }
}
