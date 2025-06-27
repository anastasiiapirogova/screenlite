import { Socket } from 'socket.io'
import { z } from 'zod'
import { DeviceRepository } from '../repositories/DeviceRepository.ts'
import { DeviceService } from '../services/DeviceService.ts'
import { DeviceTelemetryService } from '../services/DeviceTelemetryService.ts'
import { deviceDataSchema } from '../schemas/deviceSchemas.ts'

export type DeviceData = z.infer<typeof deviceDataSchema>

export const handleDeviceData = async (rawData: unknown, socket: Socket) => {
    const validationResult = deviceDataSchema.safeParse(rawData)

    if (!validationResult.success) {
        socket.emit('error', { 
            handle: 'deviceData', 
            errors: validationResult.error.errors 
        })
        return
    }

    const deviceData = validationResult.data
    const { token: existingToken } = deviceData

    try {
        let deviceToken: string

        if (await DeviceRepository.isDeviceTokenValid(existingToken)) {
            deviceToken = existingToken!
        } else {
            const newDevice = await DeviceService.initNewDevice()

            deviceToken = newDevice.token
        }

        const deviceResponse = await DeviceTelemetryService.storeDeviceTelemetry(
            deviceToken, 
            deviceData, 
            socket
        )

        return deviceResponse
    } catch (error) {
        socket.emit('error', { 
            handle: 'deviceData', 
            message: 'Failed to process device data',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        return
    }
}
