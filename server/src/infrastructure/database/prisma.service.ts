import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

export class PrismaService {
    public client: PrismaClient

    constructor(connectionString: string) {    
        const adapter = new PrismaPg({ connectionString })

        this.client = new PrismaClient({
            adapter,
        })
    }

    async connect() {
        await this.client.$connect()
    }

    async disconnect() {
        await this.client.$disconnect()
    }
}