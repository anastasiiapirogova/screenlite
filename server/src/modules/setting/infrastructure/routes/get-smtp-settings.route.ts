import { FastifyInstance } from 'fastify'
import { GetSMTPSettingsUsecase } from '@/modules/setting/application/usecases/get-smtp-settings.usecase.ts'
import { SMTPGroup } from '@/modules/setting/domain/groups/smtp.group.ts'

// Prefix: /api/admin/settings
export const getSMTPSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.get('/smtp', async (_request, reply) => {
        const smtpGroup = new SMTPGroup(fastify.encryption)

        const usecase = new GetSMTPSettingsUsecase(fastify.settingRepository, smtpGroup)

        const smtpSettings = await usecase.execute()

        reply.send(smtpSettings)
    })
}