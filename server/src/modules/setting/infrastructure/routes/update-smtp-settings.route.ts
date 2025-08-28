import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateSMTPSettingsUsecase } from '@/modules/setting/application/usecases/update-smtp-settings.usecase.ts'
import { SMTPGroup } from '@/modules/setting/domain/groups/smtp.group.ts'
import { UpdateSMTPSettingsSchema } from '@/modules/setting/infrastructure/schemas/update-smtp.schema.ts'

// Prefix: /api/admin/settings
export const updateSMTPSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().patch('/smtp', {
        schema: {
            body: UpdateSMTPSettingsSchema,
        },
    }, async (request, reply) => {
        const body = request.body

        const smtpGroup = new SMTPGroup(fastify.encryption)
        
        const usecase = new UpdateSMTPSettingsUsecase(fastify.settingRepository, smtpGroup)

        const updatedSettings = await usecase.execute(body)

        reply.send(updatedSettings)
    })
}