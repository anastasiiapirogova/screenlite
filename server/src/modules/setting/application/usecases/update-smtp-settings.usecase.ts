import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'
import { ISettingRepository } from '../../domain/setting-repository.interface.ts'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'

export class UpdateSMTPSettingsUsecase {
    constructor(
        private readonly settingRepository: ISettingRepository,
        private readonly smtpGroup: SMTPGroup
    ) {}

    async execute(newSettings: Partial<SMTPSettings>): Promise<SMTPSettings> {
        const settings = this.smtpGroup.toSettings(newSettings)

        await this.settingRepository.saveMany(settings)

        const updatedSettings = await this.settingRepository.findByCategory('smtp')

        return this.smtpGroup.fromSettings(updatedSettings)
    }
}