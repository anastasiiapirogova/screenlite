import { FastifyInstance } from 'fastify'
import { GetMailSettingsUsecase } from '@/modules/setting/application/usecases/get-mail-settings.usecase.ts'
import { MailGroup } from '@/modules/setting/domain/groups/mail.group.ts'

// Prefix: /api/admin/settings
export const getMailSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.get('/mail', async (_request, reply) => {
        const mailGroup = new MailGroup(fastify.encryption)
        const usecase = new GetMailSettingsUsecase(fastify.settingRepository, mailGroup)
        const mailSettings = await usecase.execute()

        reply.send(mailSettings)
    })
}