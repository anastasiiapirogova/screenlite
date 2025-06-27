import { getIpFromRequest } from '@/utils/getIpFromRequest.ts'
import { NamedRateLimitConfig } from '@/utils/RateLimiterManager.ts'
import { Request } from 'express'

export const authRateLimiterConfig: NamedRateLimitConfig[] = [
    {
        name: 'login_attempt',
        keyGenerator: (req: Request) => {
            const email = req.body.email

            if (typeof email !== 'string' || email.trim().length === 0) {
                throw new Error('Email is required for login attempts')
            }

            return `login_attempt:${email}:${getIpFromRequest(req)}`
        },
        options: { limit: 10, window: { value: 1, unit: 'minutes' } },
    },
    {
        name: 'signup',
        keyGenerator: (req: Request) => `signup:${getIpFromRequest(req)}`,
        options: { limit: 3, window: { value: 10, unit: 'minutes' } },
    }
]