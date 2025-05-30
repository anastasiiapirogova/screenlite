import { createBuckets } from './config/s3Client.js'
import { GracefulShutdown } from './types.js'
import { initPrisma } from './config/prisma.js'
import { server } from './config/express.js'
import { registerListeners } from './listeners/registerListeners.js'
import { initSocketIo } from './controllers/socket.js'
import { closeWorkers } from 'bullmq/workers.js'

export const APP_VERSION = '0.0.1'

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
    registerListeners()
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

bootstrap()