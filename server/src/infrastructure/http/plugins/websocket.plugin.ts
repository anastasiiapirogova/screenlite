import fp from 'fastify-plugin'
import { WebSocketServer as Server } from 'ws'
import type { FastifyPluginAsync } from 'fastify'
import { WebSocketConnectionRepository } from '@/infrastructure/websocket/repositories/websocket-connection.repository.ts'
import { WebSocketConnectionManager } from '@/infrastructure/websocket/services/websocket-connection-manager.service.ts'
import { IWebSocketConnectionRepository } from '@/core/ports/websocket-connection.repository.interface.ts'
import { IWebSocketSubscriptionRepository } from '@/core/ports/websocket-subscription.repository.interface.ts'
import { WebSocketSubscriptionRepository } from '@/infrastructure/websocket/repositories/websocket-subscription.repository.ts'

declare module 'fastify' {
    interface FastifyInstance {
        websocket: {
            connectionRepository: IWebSocketConnectionRepository
            subscriptionRepository: IWebSocketSubscriptionRepository
        }
    }
}

const websocketPlugin: FastifyPluginAsync = async (fastify) => {
    const connectionRepository = new WebSocketConnectionRepository()

    const subscriptionRepository = new WebSocketSubscriptionRepository()

    const connectionManager = new WebSocketConnectionManager({
        connectionRepository,
        onConnect: (connectionId) => {
            console.log(`WebSocket connection established: ${connectionId}`)
        },
        onMessage: (connectionId, message) => {
            console.log(`WebSocket message received: ${message} from ${connectionId}`)
        },
        onClose: (connectionId) => {
            connectionRepository.unregisterConnection(connectionId)
        },
        onError: (connectionId, error) => {
            console.error(`WebSocket error on connection ${connectionId}:`, error)
        },
    })

    fastify.decorate('websocket', {
        connectionRepository,
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