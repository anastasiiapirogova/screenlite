import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { ICryptoService } from '@/core/ports/crypto.interface.ts'
import { NodeCryptoService } from '@/infrastructure/crypto/node-crypto.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        crypto: ICryptoService
    }
}

const cryptoPlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.config?.secrets?.cryptoSecret) {
        throw new Error('Missing cryptoSecret in config')
    }

    const cryptoService = new NodeCryptoService(fastify.config.secrets.cryptoSecret)

    fastify.decorate('crypto', cryptoService)
}

export default fp(cryptoPlugin, {
    name: 'crypto',
    dependencies: ['config'],
})