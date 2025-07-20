import { FastifyServer } from '@/infrastructure/http/server/fastify.server.ts'

const fastifyServer = new FastifyServer()

fastifyServer.start(3000)

const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} received, stopping server...`)
    const stopStart = Date.now()
  
    try {
        await fastifyServer.stop()

        console.log(`Server stopped gracefully in ${Date.now() - stopStart}ms`)
    } catch (err) {
        console.error('Error stopping server:', err)
        process.exit(1)
    }
  
    process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))