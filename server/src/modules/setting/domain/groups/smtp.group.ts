import { SMTPSettings } from '@/core/types/smtp-settings.type.ts'
import { SettingGroup } from '../setting-group.abstract.ts'

export class SMTPGroup extends SettingGroup<SMTPSettings> {
    readonly category = 'smtp'
    readonly defaultValues: SMTPSettings = {
        host: '',
        port: 587,
        username: '',
        password: '',
        secure: true,
        senderEmail: '',
        senderName: '',
    }

    protected getType(key: string): string {
        switch (key) {
            case 'port': return 'number'
            case 'secure': return 'boolean'
            default: return 'string'
        }
    }

    protected isEncrypted(key: string): boolean {
        return key === 'password'
    }
}