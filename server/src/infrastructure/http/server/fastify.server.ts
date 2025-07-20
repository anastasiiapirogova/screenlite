import fastify, { FastifyInstance } from 'fastify'
import { registerRoutes } from '../routes/index.ts'
import plugins from '../plugins/index.ts'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import formBody from '@fastify/formbody'

export class FastifyServer {
    private app: FastifyInstance

    constructor() {
        this.app = fastify({ logger: true })
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
        await this.app.register(plugins.configPlugin)
        await this.app.register(plugins.cryptoPlugin)
        await this.app.register(plugins.redisPlugin)
        await this.app.register(plugins.messageBrokerPlugin)
        await this.app.register(plugins.s3ClientPlugin)
        await this.app.register(plugins.multipartUploadPlugin)
        await this.app.register(plugins.storagePlugin)
        await this.app.register(plugins.prismaPlugin)
        await this.app.register(plugins.settingsPlugin)
        await this.app.register(plugins.mailPlugin)
        await this.app.register(plugins.customValidationErrorHandler)
        await this.app.register(plugins.websocketPlugin)
    }

    get instance(): FastifyInstance {
        return this.app
    }
}