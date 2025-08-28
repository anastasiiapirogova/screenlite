import { FastifyInstance } from 'fastify'
import { ThumbnailGenerationService } from '../services/thumbnail-generation.service.ts'
import { SharpImageProcessor } from '@/shared/infrastructure/services/sharp-image-processor.service.ts'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { fileKey } from '@/shared/schemas/file.schemas.ts'
import { EtagService } from '@/shared/infrastructure/services/etag.service.ts'

export const getThumbnailRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/thumbnail/*', {
        schema: {
            params: z.object({
                '*': fileKey
            })
        },
        config: {
            allowGuest: true,
            allowDeletedUser: true,
        }
    },async (request, reply) => {
        const fileKey = request.params['*']
        
        const sharpImageProcessor = new SharpImageProcessor()
        const etagService = new EtagService()
        const thumbnailService = new ThumbnailGenerationService({
            storage: fastify.storage,
            imageProcessor: sharpImageProcessor,
        })
        
        const thumbnail = await thumbnailService.generateThumbnail(fileKey, {
            maxWidth: 200,
            maxHeight: 200
        })

        const clientETag = request.headers['if-none-match']
        const thumbnailETag = etagService.generate(thumbnail.buffer)

        if (clientETag && clientETag === thumbnailETag) {
            return reply.code(304).header('ETag', thumbnailETag).send()
        }

        reply.header('Content-Type', thumbnail.mimeType)
        reply.header('Content-Length', thumbnail.contentLength)
        reply.header('Cache-Control', 'public, max-age=3600')
        reply.header('ETag', thumbnailETag)

        return reply.send(thumbnail.buffer)
    })
}