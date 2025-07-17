import { SettingGroup } from '../setting-group.abstract.ts'
import { MailSettings } from '@/shared/types/mail-settings.type.ts'

export class MailGroup extends SettingGroup<MailSettings> {
    readonly category = 'mail'
    readonly defaultValues: MailSettings = {
        adapter: 'log',
    }

    protected getType(key: string): string {
        switch (key) {
            default: return 'string'
        }
    }

    protected isEncrypted(): boolean {
        return false
    }
}