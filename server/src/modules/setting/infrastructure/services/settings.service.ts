import { ISettingRepository } from '../../domain/setting-repository.interface.ts'
import { SettingGroup } from '../../domain/setting-group.abstract.ts'
import { SettingGroupTypes } from '../../domain/types/settings.type.ts'

export class SettingsService {
    constructor(
        private readonly settingRepository: ISettingRepository,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private readonly groups: SettingGroup<any>[]
    ) {}

    async getGroup<K extends keyof SettingGroupTypes>(groupName: K): Promise<SettingGroupTypes[K]> {
        const group = this.groups.find(g => g.category === groupName)

        if (!group) throw new Error(`Settings group not found: ${groupName}`)
      
        const settings = await this.settingRepository.findByCategory(groupName)

        return await group.fromSettings(settings) as SettingGroupTypes[K]
    }
}