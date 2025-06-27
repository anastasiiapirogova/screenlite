import { prisma } from '@/config/prisma.ts'
import { DeviceData } from '../types.ts'

export class DeviceTelemetryRepository {
    static async createTelemetry(token: string, data: DeviceData, publicIp: string) {
        return await prisma.deviceTelemetry.create({
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
    }

    static async getLatestTelemetryByDeviceId(deviceId: string) {
        return await prisma.deviceTelemetry.findFirst({
            where: { deviceId },
            orderBy: { createdAt: 'desc' }
        })
    }

    static async getTelemetryHistory(deviceId: string, limit: number = 100) {
        return await prisma.deviceTelemetry.findMany({
            where: { deviceId },
            orderBy: { createdAt: 'desc' },
            take: limit
        })
    }

    static async deleteOldTelemetry(deviceId: string, olderThanDays: number = 30) {
        const cutoffDate = new Date()

        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

        return await prisma.deviceTelemetry.deleteMany({
            where: {
                deviceId,
                createdAt: {
                    lt: cutoffDate
                }
            }
        })
    }
} 