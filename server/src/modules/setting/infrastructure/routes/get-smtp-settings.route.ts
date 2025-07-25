import { FastifyInstance } from 'fastify'
import { GetSMTPSettingsUsecase } from '@/modules/setting/application/usecases/get-smtp-settings.usecase.ts'
import { PrismaSettingRepository } from '@/modules/setting/infrastructure/repositories/prisma-setting.repository.ts'
import { SMTPGroup } from '@/modules/setting/domain/groups/smtp.group.ts'

export const getSMTPSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.get('/smtp', async (request, reply) => {
        const settingRepository = new PrismaSettingRepository(request.server.prisma)

        const smtpGroup = new SMTPGroup(request.server.encryption)

        const usecase = new GetSMTPSettingsUsecase(settingRepository, smtpGroup)

        const smtpSettings = await usecase.execute()

        reply.send(smtpSettings)
    })
}