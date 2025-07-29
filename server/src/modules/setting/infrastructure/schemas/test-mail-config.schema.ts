import { portSchema } from '@/shared/schemas/network.schemas.ts'
import { z } from 'zod'

export const TestMailConfigSchema = z.object({
    adapter: z.enum(['log', 'smtp']),
    smtp: z.object({
        host: z.string(),
        port: portSchema,
        username: z.string(),
        password: z.string(),
        secure: z.coerce.boolean(),
        senderName: z.string(),
        senderEmail: z.email(),
    }).optional(),
}).refine((data) => {
    if (data.adapter === 'smtp' && !data.smtp) {
        return false
    }

    return true
}, {
    message: 'SMTP config is required when adapter is smtp',
    path: ['smtp']
})

export type TestMailConfigDTO = z.infer<typeof TestMailConfigSchema>