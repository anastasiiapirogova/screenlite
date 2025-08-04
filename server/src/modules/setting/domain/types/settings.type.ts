import { MailSettings } from '@/core/types/mail-settings.type.ts'
import { SMTPSettings } from '@/core/types/smtp-settings.type.ts'

export type SettingGroupTypes = {
    mail: MailSettings
    smtp: SMTPSettings
}