import { z } from 'zod'

export const appSchema = z.object({
    frontendVersion: z.string().default('0.0.1'),
    backendVersion: z.string().default('0.0.1'),
    frontendUrl: z.url().default('http://localhost:3001'),
    backendUrl: z.url().default('http://localhost:3000'),
    allowedCorsOrigins: z.array(z.string()).default(['http://localhost:3001']),
    environment: z.enum(['development', 'production']).default('development'),
})