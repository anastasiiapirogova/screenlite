import { RemoveSMTPSettingsUsecase } from '@/modules/setting/application/usecases/remove-smtp-settings.usecase.ts'
import { FastifyInstance } from 'fastify'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'

// Prefix: /api/admin/settings
export const removeSMTPSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.delete('/smtp', async (_request, reply) => {
        const smtpGroup = new SMTPGroup(fastify.encryption)

        const usecase = new RemoveSMTPSettingsUsecase(fastify.settingRepository, smtpGroup)

        await usecase.execute()

        reply.status(204).send()
    })
}   