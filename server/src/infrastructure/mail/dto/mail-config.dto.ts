import { SMTPSettings } from '@/shared/types/smtp-settings.type.ts'

export type MailConfig = {
    adapter: 'log' | 'smtp'
    smtp?: SMTPSettings
}