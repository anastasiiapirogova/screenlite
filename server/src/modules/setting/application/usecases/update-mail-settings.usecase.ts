import { MailSettings } from '@/shared/types/mail-settings.type.ts'
import { ISettingRepository } from '../../domain/setting-repository.interface.ts'
import { MailGroup } from '../../domain/groups/mail.group.ts'

export class UpdateMailSettingsUsecase {
    constructor(
        private readonly settingRepository: ISettingRepository,
        private readonly mailGroup: MailGroup
    ) {}

    async execute(newSettings: Partial<MailSettings>): Promise<MailSettings> {
        const settings = this.mailGroup.toSettings(newSettings)

        await this.settingRepository.updateMany(settings)

        const updatedSettings = await this.settingRepository.findByCategory('mail')

        return this.mailGroup.fromSettings(updatedSettings)
    }
}