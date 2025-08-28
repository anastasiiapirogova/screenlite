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
        const thumbnailService = new ThumbnailGenerationService(fastify.storage, sharpImageProcessor, etagService)
        
        const result = await thumbnailService.generateThumbnail(fileKey, {
            maxWidth: 200,
            maxHeight: 200
        })

        reply.header('Content-Type', result.mimeType)
        reply.header('Content-Length', result.contentLength)
        reply.header('Cache-Control', 'public, max-age=3600')
        reply.header('ETag', result.etag)

        return reply.send(result.buffer)
    })
}