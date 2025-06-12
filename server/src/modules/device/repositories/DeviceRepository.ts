import { prisma } from '@config/prisma.js'
import crypto from 'crypto'

// Some characters are excluded because they can be easily confused with others
// (e.g., 'I' with '1', 'O' with '0') to improve readability.
export const CONNECTION_CODE_CHARACTERS = 'BCDFGHJKMPQRTVWXY346789'
const CODE_LENGTH = 6

export class DeviceRepository {
    static async doesDeviceTokenExist(token: string | null): Promise<boolean> {
        if (!token) {
            return false
        }
    
        const device = await prisma.device.findUnique({
            where: { token },
        })
    
        return device !== null
    }

    static async generateConnectionCode(): Promise<string> {
        let result = ''

        for (let i = 0; i < CODE_LENGTH; i++) {
            let byte: number
            const maxValidByte = 256 - (256 % CONNECTION_CODE_CHARACTERS.length)

            do {
                byte = crypto.randomBytes(1)[0]
            } while (byte >= maxValidByte)
            result += CONNECTION_CODE_CHARACTERS[byte % CONNECTION_CODE_CHARACTERS.length]
        }

        return result
    }

    static generateDeviceToken(): string {
        return crypto.randomBytes(32).toString('hex')
    }

    static async connectScreen(deviceId: string, screenId: string) {
        return await prisma.device.update({
            where: {
                id: deviceId,
            },
            data: {
                screenId: screenId,
            },
            include: {
                telemetry: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                statusLog: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
            }
        })
    }

    static async findByConnectionCode(connectionCode: string) {
        return await prisma.device.findFirst({
            where: {
                connectionCode: connectionCode,
            }
        })
    }
}