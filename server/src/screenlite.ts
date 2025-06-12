import { createBuckets } from './config/s3Client.js'
import { GracefulShutdown } from './types.js'
import { initPrisma } from './config/prisma.js'
import { initSocketIo } from './controllers/socket.js'
import { closeWorkers } from 'bullmq/workers.js'
import './config/rateLimiter.js'
import { server } from '@config/server.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}

const gracefulShutdown: GracefulShutdown = async (signal) => {
    console.log(`Received ${signal}, closing server...`)
    await closeWorkers()
    process.exit(0)
}

const bootstrap = async () => {
    try {
        await initPrisma()
        await createBuckets()
    } catch (error) {
        console.error('Error during bootstrap:', error)
        await closeWorkers()
        process.exit(1)
    }

    initSocketIo(server)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

bootstrap()