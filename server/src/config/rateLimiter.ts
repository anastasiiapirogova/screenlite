import { authRateLimiterConfig } from '@/modules/auth/authRateLimiterConfig.js'
import { RateLimiterManager } from '@/utils/RateLimiterManager.js'

export const rateLimiter = new RateLimiterManager()

const rateLimiterConfigs = [
    authRateLimiterConfig
].flat()

try {
    for (const config of rateLimiterConfigs) {
        rateLimiter.register(config)
    }
    console.log('Screenlite: Rate limiter initialized successfully')
} catch (error) {
    console.error('Screenlite: Error initializing rate limiter:', error)
    process.exit(1)
}