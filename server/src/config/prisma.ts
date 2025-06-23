import { PrismaClient } from '@/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({
    connectionString: connectionString,
})

export const prisma = new PrismaClient({
    adapter,
    omit: {
        user: {
            totpSecret: true,
            password: true
        }
    }
}).$extends({
    result: {
        screen: {
            layoutResolution: {
                needs: { layoutRotation: true, resolutionWidth: true, resolutionHeight: true },
                compute(screen) {
                    const isRotated = screen.layoutRotation === 'R90' || screen.layoutRotation === 'R270'

                    return {
                        width: isRotated ? screen.resolutionHeight : screen.resolutionWidth,
                        height: isRotated ? screen.resolutionWidth : screen.resolutionHeight,
                    }
                },
            },
        },
    }
})

export const initPrisma = async () => {
    try {
        await prisma.$connect()

        return prisma
    } catch (error) {
        console.error('Failed to initialize Prisma Client:', error)
        process.exit(1)
    }
}