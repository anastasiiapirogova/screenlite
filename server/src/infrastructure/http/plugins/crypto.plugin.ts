import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { CryptoServiceInterface } from '@/core/ports/crypto.interface.ts'
import { NodeCryptoService } from '@/infrastructure/crypto/node-crypto.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        crypto: CryptoServiceInterface
    }
}

const cryptoPlugin: FastifyPluginAsync = async (server) => {
    if (!server.config?.secrets?.cryptoSecret) {
        throw new Error('Missing cryptoSecret in config')
    }

    const cryptoService = new NodeCryptoService(server.config.secrets.cryptoSecret)

    server.decorate('crypto', cryptoService)
}

export default fp(cryptoPlugin, {
    name: 'crypto',
    dependencies: ['config'],
})