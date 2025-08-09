import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'

const corsPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(cors, {
        origin: (origin, cb) => {
            if(!origin) return cb(null, true)
                
            const hostname = new URL(origin).hostname

            if(hostname === 'localhost' || hostname === '127.0.0.1'){
                cb(null, true)
                return
            }

            if(fastify.config.app.allowedCorsOrigins.includes(origin)){
                cb(null, true)
                return
            }

            cb(new Error('Not allowed'), false)
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
}

export default fp(corsPlugin, {
    name: 'cors',
    dependencies: ['config'],
})