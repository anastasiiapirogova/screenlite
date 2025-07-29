import { FastifyInstance } from 'fastify'
import { GetMailSettingsUsecase } from '@/modules/setting/application/usecases/get-mail-settings.usecase.ts'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { MailGroup } from '@/modules/setting/domain/groups/mail.group.ts'

// Prefix: /api/admin/settings
export const getMailSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.get('/mail', async (_request, reply) => {
        const settingRepository = new PrismaSettingRepository(fastify.prisma)
        const mailGroup = new MailGroup(fastify.encryption)
        const usecase = new GetMailSettingsUsecase(settingRepository, mailGroup)
        const mailSettings = await usecase.execute()

        reply.send(mailSettings)
    })
}