import { MailSettings } from '@/core/types/mail-settings.type.ts'
import { ISettingRepository } from '../../domain/setting-repository.interface.ts'
import { MailGroup } from '../../domain/groups/mail.group.ts'

export class UpdateMailSettingsUsecase {
    constructor(
        private readonly settingRepository: ISettingRepository,
        private readonly mailGroup: MailGroup
    ) {}

    async execute(newSettings: Partial<MailSettings>): Promise<MailSettings> {
        const settings = await this.mailGroup.toSettings(newSettings)

        await this.settingRepository.saveMany(settings)

        const updatedSettings = await this.settingRepository.findByCategory('mail')

        return await this.mailGroup.fromSettings(updatedSettings)
    }
}   