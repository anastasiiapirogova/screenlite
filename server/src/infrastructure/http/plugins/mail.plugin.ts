import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { MailServiceInterface } from '@/core/ports/mail.interface.ts'
import { MailService } from '../../../infrastructure/mail/application/mail.service.ts'
import { MailConfigManager } from '../../../infrastructure/mail/application/mail-config.manager.ts'

declare module 'fastify' {
    interface FastifyInstance {
        mail: MailServiceInterface
    }
}

const mailPlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.settings) {
        throw new Error('Settings service not registered')
    }

    if (!fastify.config?.app?.backendUrl) {
        throw new Error('Missing backendUrl in config')
    }
  
    const mailConfigManager = new MailConfigManager(fastify.settings)
    
    const mailService = new MailService(mailConfigManager, fastify.config.app.backendUrl)

    fastify.decorate('mail', mailService)

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying mail service')
    })
}

export default fp(mailPlugin, {
    name: 'mail',
    dependencies: ['config', 'prisma', 'crypto', 'settings'],
})