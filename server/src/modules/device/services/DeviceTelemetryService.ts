import { Socket } from 'socket.io'
import { getIpFromSocket } from '../helpers/getIpFromSocket.ts'
import { DeviceData } from '../types.ts'
import { DeviceTelemetryRepository } from '../repositories/DeviceTelemetryRepository.ts'

export class DeviceTelemetryService {
    static async storeDeviceTelemetry(token: string, data: DeviceData, socket: Socket) {
        const publicIp = getIpFromSocket(socket)

        await DeviceTelemetryRepository.createTelemetry(token, data, publicIp)

        return { token }
    }

    static async getLatestTelemetry(deviceId: string) {
        return await DeviceTelemetryRepository.getLatestTelemetryByDeviceId(deviceId)
    }

    static async getTelemetryHistory(deviceId: string, limit?: number) {
        return await DeviceTelemetryRepository.getTelemetryHistory(deviceId, limit)
    }

    static async cleanupOldTelemetry(deviceId: string, olderThanDays?: number) {
        return await DeviceTelemetryRepository.deleteOldTelemetry(deviceId, olderThanDays)
    }
} 