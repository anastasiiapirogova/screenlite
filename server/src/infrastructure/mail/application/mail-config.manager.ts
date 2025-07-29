import { SettingsService } from '@/modules/setting/infrastructure/services/settings.service.ts'
import { MailConfig } from '@/infrastructure/mail/dto/mail-config.dto.ts'
import { IObjectHasher } from '@/core/ports/object-hasher.interface.ts'

export class MailConfigManager {
    private lastConfigHash: string | null = null
    private currentConfig: MailConfig | null = null

    constructor(
        private readonly settingService: SettingsService,
        private readonly objectHasher: IObjectHasher
    ) {}

    async getCurrentConfig(): Promise<MailConfig> {
        const mailConfig = await this.settingService.getGroup('mail')
        const smtpConfig = await this.settingService.getGroup('smtp')

        const config: MailConfig = {
            ...mailConfig,
            smtp: smtpConfig,
        }

        const currentHash = await this.objectHasher.hash(config)

        if (!this.currentConfig || currentHash !== this.lastConfigHash) {
            this.currentConfig = config
            this.lastConfigHash = currentHash
        }

        return this.currentConfig
    }
}