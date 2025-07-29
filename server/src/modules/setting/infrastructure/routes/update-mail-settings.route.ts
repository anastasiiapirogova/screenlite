import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateMailSettingsUsecase } from '@/modules/setting/application/usecases/update-mail-settings.usecase.ts'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { MailGroup } from '@/modules/setting/domain/groups/mail.group.ts'
import { UpdateMailSettingsSchema } from '../schemas/update-mail.schema.ts'

// Prefix: /api/admin/settings
export const updateMailSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().patch('/mail', {
        schema: {
            body: UpdateMailSettingsSchema,
        },
    }, async (request, reply) => {
        const body = request.body
        const settingRepository = new PrismaSettingRepository(fastify.prisma)
        const mailGroup = new MailGroup(fastify.encryption)
        const usecase = new UpdateMailSettingsUsecase(settingRepository, mailGroup)
        const updatedSettings = await usecase.execute(body)

        reply.send(updatedSettings)
    })
}