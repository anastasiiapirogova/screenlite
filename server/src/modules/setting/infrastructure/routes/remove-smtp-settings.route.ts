import { RemoveSMTPSettingsUsecase } from '@/modules/setting/application/usecases/remove-smtp-settings.usecase.ts'
import { PrismaSettingRepository } from '../repositories/prisma-setting.repository.ts'
import { FastifyInstance } from 'fastify'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'

export const removeSMTPSettingsRoute = async (fastify: FastifyInstance) => {
    fastify.delete('/smtp', async (request, reply) => {
        const settingRepository = new PrismaSettingRepository(fastify.prisma)

        const smtpGroup = new SMTPGroup(fastify.encryption)

        const usecase = new RemoveSMTPSettingsUsecase(settingRepository, smtpGroup)

        await usecase.execute()

        reply.status(204).send()
    })
}   