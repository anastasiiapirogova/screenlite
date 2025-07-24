import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { IEncryptionService } from '@/core/ports/encryption-service.interface.ts'
import { NodeEncryptionService } from '@/infrastructure/encryption/node-crypto.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        encryption: IEncryptionService
    }
}

const encryptionPlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.config?.secrets?.encryptionSecret) {
        throw new Error('Missing encryptionSecret in config')
    }

    const encryptionService = new NodeEncryptionService(fastify.config.secrets.encryptionSecret)

    fastify.decorate('encryption', encryptionService)
}

export default fp(encryptionPlugin, {
    name: 'encryption',
    dependencies: ['config'],
})