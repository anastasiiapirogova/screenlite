import { Response } from 'express'
import { RateLimitResponse } from './RateLimiter.ts'

export const setRateLimitHeaders = (res: Response, rateLimitResponse: RateLimitResponse) => {
    if (rateLimitResponse.allowed) {
        res.set('X-RateLimit-Limit', rateLimitResponse.limit.toString())
        res.set('X-RateLimit-Remaining', rateLimitResponse.remaining.toString())
        res.set('X-RateLimit-Reset', rateLimitResponse.resetIn.toString())
    } else {
        res.set('Retry-After', rateLimitResponse.resetIn.toString())
    }
}
