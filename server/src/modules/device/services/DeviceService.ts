import { DeviceRepository } from '../repositories/DeviceRepository.js'

export class DeviceService {
    private static async generateUniqueConnectionCode(): Promise<string> {
        const connectionCode = await DeviceRepository.generateConnectionCode()

        const existingDevice = await DeviceRepository.findDeviceByConnectionCode(connectionCode)

        if (existingDevice) {
            return this.generateUniqueConnectionCode()
        }

        return connectionCode
    }

    static async initNewDevice() {
        const connectionCode = await this.generateUniqueConnectionCode()

        const token = DeviceRepository.generateDeviceToken()

        const device = await DeviceRepository.createDevice(token, connectionCode)

        return device
    }
} 