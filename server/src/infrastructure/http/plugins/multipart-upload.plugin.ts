import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { MultipartFileUploader } from '@/core/ports/multipart-file-upload.interface.ts'
import { MultipartUploadFactory } from '@/infrastructure/storage/factories/multipart-upload.factory.ts'

declare module 'fastify' {
    interface FastifyInstance {
        multipartUpload: MultipartFileUploader
    }
}

const multipartUploadPlugin: FastifyPluginAsync = async (fastify) => {
    const multipartUploadFactory = new MultipartUploadFactory(
        fastify.config,
        fastify.s3Client,
        fastify.redis.getClient('default')
    )

    fastify.decorate('multipartUpload', multipartUploadFactory.createUploader())

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying multipart upload service')
    })
}

export default fp(multipartUploadPlugin, {
    name: 'multipartUpload',
    dependencies: ['config', 'redis', 's3Client'],
})