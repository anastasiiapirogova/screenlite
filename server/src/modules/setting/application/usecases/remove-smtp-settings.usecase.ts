import { ISettingRepository } from '../../domain/setting.repository.ts'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'

export class RemoveSMTPSettingsUsecase {
    constructor(
        private readonly settingRepository: ISettingRepository,
        private readonly smtpGroup: SMTPGroup
    ) {}

    async execute(): Promise<void> {
        await this.settingRepository.deleteByCategory(this.smtpGroup.category)
    }
}