import { MailSettings } from '@/shared/types/mail-settings.type.ts'
import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'

export type SettingGroupTypes = {
    mail: MailSettings
    smtp: SMTPSettings
}