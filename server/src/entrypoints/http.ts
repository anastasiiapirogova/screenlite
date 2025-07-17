import { FastifyServer } from '@/infrastructure/http/server/fastify.server.ts'

const fastifyServer = new FastifyServer()

fastifyServer.start(3000)

process.on('SIGTERM', async () => {
    await fastifyServer.stop()
    process.exit(0)
})