import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { ISettingRepository } from '@/modules/setting/domain/setting.repository.ts'
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

    if (!fastify.encryption) {
        throw new Error('Encryption service not registered')
    }

    const settingRepository: ISettingRepository = new PrismaSettingRepository(fastify.prisma)

    const settingService = new SettingsService(settingRepository, [new MailGroup(fastify.encryption), new SMTPGroup(fastify.encryption)])

    fastify.decorate('settings', settingService)

    fastify.addHook('onClose', async () => {
        fastify.log.info('Destroying settings service')
    })
}

export default fp(settingsPlugin, {
    name: 'settings',
    dependencies: ['config', 'prisma', 'encryption'],
})