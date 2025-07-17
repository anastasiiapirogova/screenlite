import { hashValue } from '@/shared/utils/crypto/crypto.utils.ts'
import { SettingsService } from '@/modules/setting/infrastructure/services/settings.service.ts'
import { MailConfig } from '../dto/mail-config.dto.ts'

export class MailConfigManager {
    private lastConfigHash: string | null = null
    private currentConfig: MailConfig | null = null

    constructor(
        private readonly settingService: SettingsService
    ) {}

    async getCurrentConfig(): Promise<MailConfig> {
        const mailConfig = await this.settingService.getGroup('mail')
        const smtpConfig = await this.settingService.getGroup('smtp')

        const config: MailConfig = {
            ...mailConfig,
            smtp: smtpConfig,
        }

        const currentHash = hashValue(config)

        if (!this.currentConfig || currentHash !== this.lastConfigHash) {
            this.currentConfig = config
            this.lastConfigHash = currentHash
        }

        return this.currentConfig
    }
}