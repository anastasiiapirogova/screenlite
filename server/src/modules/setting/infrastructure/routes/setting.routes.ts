import { FastifyInstance } from 'fastify'
import { updateSMTPSettingsRoute } from './update-smtp-settings.route.ts'
import { removeSMTPSettingsRoute } from './remove-smtp-settings.route.ts'
import { getSMTPSettingsRoute } from './get-smtp-settings.route.ts'
import { getMailSettingsRoute } from './get-mail-settings.route.ts'
import { updateMailSettingsRoute } from './update-mail-settings.route.ts'
import { testMailConfigRoute } from './test-mail-config.route.ts'

// Prefix: /api/admin/settings
const settingRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        updateSMTPSettingsRoute(fastify),
        removeSMTPSettingsRoute(fastify),
        getSMTPSettingsRoute(fastify),
        getMailSettingsRoute(fastify),
        updateMailSettingsRoute(fastify),
        testMailConfigRoute(fastify),
    ])
}

export default settingRoutes