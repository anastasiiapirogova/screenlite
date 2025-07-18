import fp from 'fastify-plugin'
import { ConfigService } from '@/infrastructure/config/config.service.ts'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        config: ConfigService
    }
}

const configPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorate('config', new ConfigService())
}

export default fp(configPlugin, {
    name: 'config',
})