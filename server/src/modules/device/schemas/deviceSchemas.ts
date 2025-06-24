import { z } from 'zod'

export const deviceDataSchema = z.object({
    token: z.string().nullable(),
    localIpAddress: z.string(),
    macAddress: z.string(),
    softwareVersion: z.string(),
    screenResolutionWidth: z.number(),
    screenResolutionHeight: z.number(),
    platform: z.string(),
    hostname: z.string(),
    timezone: z.string(),
    totalMemory: z.number(),
    freeMemory: z.number(),
    osRelease: z.string()
})