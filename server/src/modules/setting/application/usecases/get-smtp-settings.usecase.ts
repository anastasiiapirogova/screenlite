import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'
import { SettingRepository } from '../../domain/setting.repository.ts'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'
import { SafeDTO } from '@/shared/types/safe-dto.type.ts'

export class GetSMTPSettingsUsecase {
    constructor(
        private readonly settingRepository: SettingRepository,
        private readonly smtpGroup: SMTPGroup
    ) {}

    async execute(): Promise<SafeDTO<SMTPSettings>> {
        const settings = await this.settingRepository.findByCategory('smtp')
        const smtpSettings = this.smtpGroup.fromSettings(settings)

        return this.smtpGroup.toSafeDTO(smtpSettings)
    }
}