import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { RedisMessageBrokerAdapter } from '@/infrastructure/messaging/adapters/redis-message-broker.adapter.ts'
import { IMessageBroker } from '@/core/ports/messaging.interface.ts'
import { IMessageChannelSubscriptionManager } from '@/core/ports/message-channel-subscription-manager.interface.ts'
import { MessageChannelSubscriptionManager } from '@/infrastructure/messaging/services/message-channel-subscription-manager.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        messageBroker: IMessageBroker
        messageChannelSubscriptionManager: IMessageChannelSubscriptionManager
    }
}

const messageBrokerPlugin: FastifyPluginAsync = async (fastify) => {
    const redisPub = fastify.redis.getClient('pub').duplicate()
    const redisSub = fastify.redis.getClient('sub').duplicate()

    fastify.redis.registerClient('message-broker-pub', redisPub)
    fastify.redis.registerClient('message-broker-sub', redisSub)

    const messageBroker = new RedisMessageBrokerAdapter(redisPub, redisSub)
    const messageChannelSubscriptionManager = new MessageChannelSubscriptionManager(messageBroker)

    fastify.decorate('messageBroker', messageBroker)
    fastify.decorate('messageChannelSubscriptionManager', messageChannelSubscriptionManager)

    fastify.addHook('preClose', async () => {
        await messageChannelSubscriptionManager.shutdown()
    })

    fastify.addHook('onClose', async () => {
        await fastify.redis.destroyClient('message-broker-pub')
        await fastify.redis.destroyClient('message-broker-sub')
    })
}

export default fp(messageBrokerPlugin, {
    name: 'message-broker',
    dependencies: ['redis']
})