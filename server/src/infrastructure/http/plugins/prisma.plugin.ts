import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaService } from '@/infrastructure/database/prisma.service.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = async (server) => {
    if (!server.config?.database?.url) {
        throw new Error('Missing database.url in config')
    }

    const prismaService = new PrismaService(server.config.database.url)

    await prismaService.connect()

    server.decorate('prisma', prismaService.client)
  
    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect()
    })
}

export default fp(prismaPlugin, {
    name: 'prisma',
    dependencies: ['config'],
})