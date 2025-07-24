import { MailSettings } from '@/shared/types/mail-settings.type.ts'
import { SettingRepository } from '../../domain/setting.repository.ts'
import { MailGroup } from '../../domain/groups/mail.group.ts'

export class GetMailSettingsUsecase {
    constructor(
        private readonly settingRepository: SettingRepository,
        private readonly mailGroup: MailGroup
    ) {}

    async execute(): Promise<MailSettings> {
        const settings = await this.settingRepository.findByCategory('mail')

        return this.mailGroup.fromSettings(settings)
    }
}