import { SMTPSettings } from '@/core/types/smtp-settings.type.ts'
import { ISettingRepository } from '../../domain/setting-repository.interface.ts'
import { SMTPGroup } from '../../domain/groups/smtp.group.ts'
import { SafeDTO } from '@/core/types/safe-dto.type.ts'

export class GetSMTPSettingsUsecase {
    constructor(
        private readonly settingRepository: ISettingRepository,
        private readonly smtpGroup: SMTPGroup
    ) {}

    async execute(): Promise<SafeDTO<SMTPSettings>> {
        const settings = await this.settingRepository.findByCategory('smtp')
        const smtpSettings = this.smtpGroup.fromSettings(settings)

        return this.smtpGroup.toSafeDTO(smtpSettings)
    }
}