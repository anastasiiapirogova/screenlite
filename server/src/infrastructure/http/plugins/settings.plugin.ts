import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { SettingRepository } from '@/modules/setting/domain/setting.repository.ts'
import { MailGroup } from '@/modules/setting/domain/groups/mail.group.ts'
import { SMTPGroup } from '@/modules/setting/domain/groups/smtp.group.ts'
import { SettingsService } from '@/modules/setting/infrastructure/services/settings.service.ts'

declare module 'fastify' {
    interface FastifyInstance {
        settings: SettingsService
    }
}

const settingsPlugin: FastifyPluginAsync = async (fastify) => {
    if (!fastify.prisma) {
        throw new Error('Prisma client not registered')
    }

    if (!fastify.crypto) {
        throw new Error('Crypto service not registered')
    }

    const settingRepository: SettingRepository = new PrismaSettingRepository(fastify.prisma, fastify.crypto)

    const settingService = new SettingsService(settingRepository, [new MailGroup(), new SMTPGroup()])

    fastify.decorate('settings', settingService)

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying settings service')
    })
}

export default fp(settingsPlugin, {
    name: 'settings',
    dependencies: ['config', 'prisma', 'crypto'],
})