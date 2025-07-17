import { portSchema } from '@/shared/schemas/network.schemas.ts'
import { z } from 'zod'

export const UpdateSMTPSettingsSchema = z.object({
    host: z.string().min(1).optional().describe('SMTP server hostname'),
    port: portSchema.optional().describe('Port number'),
    username: z.string().min(1).optional().describe('Authentication username'),
    password: z.string().min(1).optional().describe('Authentication password'),
    secure: z.boolean().optional().describe('Use TLS/SSL'),
    senderName: z.string().optional().describe('Display name for outgoing emails'),
    senderEmail: z.email().optional().describe('From address for emails')
})

export type UpdateSMTPSettingsDTO = z.infer<typeof UpdateSMTPSettingsSchema>