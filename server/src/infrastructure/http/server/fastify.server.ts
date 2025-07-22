import fastify, { FastifyInstance } from 'fastify'
import { registerRoutes } from '../routes/index.ts'
import plugins from '../plugins/index.ts'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import formBody from '@fastify/formbody'

export class FastifyServer {
    private app: FastifyInstance

    constructor() {
        this.app = fastify({
            logger: true,
            trustProxy: true
        })
    }

    async start(port: number): Promise<void> {
        try {
            await this.registerZodCompiler()
            await this.registerPlugins()
            await registerRoutes(this.app)
            await this.app.listen({ port, host: '0.0.0.0' })
            console.log(`Server running on port ${port}`)
        } catch (err) {
            this.app.log.error(err)
            process.exit(1)
        }
    }

    async stop() {
        await this.app.close()
    }

    private async registerZodCompiler() {
        this.app.setValidatorCompiler(validatorCompiler)
        this.app.setSerializerCompiler(serializerCompiler)
    }

    private async registerPlugins() {
        await this.app.register(formBody)
        await this.app.register(plugins.config)
        await this.app.register(plugins.cors)
        await this.app.register(plugins.crypto)
        await this.app.register(plugins.redis)
        await this.app.register(plugins.cache)
        await this.app.register(plugins.messageBroker)
        await this.app.register(plugins.s3Client)
        await this.app.register(plugins.multipartUpload)
        await this.app.register(plugins.storage)
        await this.app.register(plugins.prisma)
        await this.app.register(plugins.settings)
        await this.app.register(plugins.mail)
        await this.app.register(plugins.errorHandler)
        await this.app.register(plugins.websocket)
    }

    get instance(): FastifyInstance {
        return this.app
    }
}