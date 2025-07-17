import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { StorageInterface } from '@/core/ports/storage.interface.ts'
import { StorageFactory } from '@/infrastructure/storage/storage.factory.ts'

declare module 'fastify' {
    interface FastifyInstance {
        storage: StorageInterface
    }
}

const storagePlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.s3client) {
        throw new Error('S3 client not registered')
    }

    if (!fastify.config?.storage) {
        throw new Error('Missing storage in config')
    }

    if (!fastify.config?.app?.backendUrl) {
        throw new Error('Missing backendUrl in config')
    }

    const s3Client = fastify.s3client

    const storage = new StorageFactory(s3Client)

    const storageAdapter = storage.create(fastify.config.storage, fastify.config.app.backendUrl)

    fastify.decorate('storage', storageAdapter)

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying storage adapter')
    })
}

export default fp(storagePlugin, {
    name: 'storage',
    dependencies: ['config', 's3client'],
})