import fp from 'fastify-plugin'
import { WebSocketServer as Server } from 'ws'
import type { FastifyPluginAsync } from 'fastify'
import { WebSocketConnectionRepository } from '@/infrastructure/websocket/repositories/websocket-connection.repository.ts'
import { WebSocketConnectionManager, WebSocketEvents } from '@/infrastructure/websocket/services/websocket-connection-manager.service.ts'
import { IWebSocketSubscriptionRepository } from '@/core/ports/websocket-subscription.repository.interface.ts'
import { WebSocketSubscriptionRepository } from '@/infrastructure/websocket/repositories/websocket-subscription.repository.ts'
import { WebSocketRouter } from '@/infrastructure/websocket/websocket.router.ts'

declare module 'fastify' {
    interface FastifyInstance {
        websocket: {
            subscriptionRepository: IWebSocketSubscriptionRepository
        }
    }
}

const websocketPlugin: FastifyPluginAsync = async (fastify) => {
    const connectionRepository = new WebSocketConnectionRepository()

    const subscriptionRepository = new WebSocketSubscriptionRepository()

    const connectionManager = new WebSocketConnectionManager(connectionRepository)

    const websocketRouter = new WebSocketRouter(connectionRepository)

    connectionManager.on(WebSocketEvents.CONNECT, (connectionId: string) => {
        websocketRouter.onConnection(connectionId)
    })

    connectionManager.on(WebSocketEvents.MESSAGE, (connectionId, message) => {
        websocketRouter.onMessage(connectionId, message)
    })

    fastify.decorate('websocket', {
        subscriptionRepository,
    })

    const wss = new Server({ noServer: true })

    fastify.server.on('upgrade', (request, socket, head) => {
        if (request.url === '/ws') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                connectionManager.handleConnection(request, ws)
            })
        }
    })

    fastify.addHook('preClose', async () => {
        fastify.log.info('Terminating all socket connections')
        connectionRepository.terminateAllConnections()
    })

    fastify.addHook('onClose', async () => {
        connectionManager.shutdown()
        
        wss.close(() => {
            fastify.log.info('Destroying websocket server')
        })
    })
}

export default fp(websocketPlugin, {
    name: 'websocket',
    dependencies: []
})