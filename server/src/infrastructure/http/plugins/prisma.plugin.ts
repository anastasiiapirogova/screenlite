import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaService } from '@/infrastructure/database/prisma.service.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.config?.database?.url) {
        throw new Error('Missing database.url in config')
    }

    const prismaService = new PrismaService(fastify.config.database.url)

    await prismaService.connect()

    fastify.decorate('prisma', prismaService.client)
  
    fastify.addHook('onClose', async (fastify) => {
        await fastify.prisma.$disconnect()
    })
}

export default fp(prismaPlugin, {
    name: 'prisma',
    dependencies: ['config'],
})