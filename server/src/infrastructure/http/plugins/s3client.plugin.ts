import fp from 'fastify-plugin'
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        s3client?: S3Client
    }
}

const s3ClientPlugin: FastifyPluginAsync = async (fastify) => {
    const s3Config = fastify.config.s3

    if (!s3Config) {
        console.log('S3 is not configured. Skipping S3 client plugin.')
        return
    }

    const s3Client = new S3Client({
        region: s3Config.region,
        endpoint: `${s3Config.endpoint}:${s3Config.port}`,
        credentials: {
            accessKeyId: s3Config.accessKey,
            secretAccessKey: s3Config.secretAccessKey || '',
        },
        forcePathStyle: true,
        requestHandler: {
            maxSockets: 500,
            keepAlive: true,
            keepAliveMsecs: 1000,
            requestTimeout: 5000,
        },
    })

    const checkConnection = async (retries = 3, delayMs = 2000) => {
        for (let i = 1; i <= retries; i++) {
            try {
                await s3Client.send(new ListBucketsCommand({}))
                return true
            } catch (error) {
                console.error(error)
                if (i < retries) await new Promise(resolve => setTimeout(resolve, delayMs))
            }
        }
        return false
    }

    const isConnected = await checkConnection()
    
    if (!isConnected) {
        throw new Error('S3 connection check failed')
    }

    fastify.decorate('s3client', s3Client)

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying S3 client')
    })
}

export default fp(s3ClientPlugin, {
    name: 's3client',
    dependencies: ['config'],
})