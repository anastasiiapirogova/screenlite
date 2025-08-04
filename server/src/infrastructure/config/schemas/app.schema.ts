import { z } from 'zod'

export const appSchema = z.object({
    frontendUrl: z.url().default('http://localhost:3001'),
    backendUrl: z.url().default('http://localhost:3000'),
    allowedCorsOrigins: z.array(z.string()).default(['http://localhost:3001']),
})