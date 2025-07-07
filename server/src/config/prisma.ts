import { PrismaClient } from '@/generated/prisma/client.ts'
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