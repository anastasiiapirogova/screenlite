import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyContextConfig {
        acceptOctetStream?: boolean
    }
}

const octetStreamPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.addContentTypeParser(
        'application/octet-stream',
        function (request, payload, done) {
            const config = request.routeOptions?.config
            
            if (!config?.acceptOctetStream) {
                return done(fastify.httpErrors.unsupportedMediaType())
            }
            
            done(null, payload)
        }
    )
}

export default fp(octetStreamPlugin, {
    name: 'octetStream',
})