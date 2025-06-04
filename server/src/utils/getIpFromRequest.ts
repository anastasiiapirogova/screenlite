import { Request } from 'express'

export const getIpFromRequest = (req: Request) => {
    // Try X-Forwarded-For header (may contain multiple IPs)
    const xForwardedFor = req.headers['x-forwarded-for']

    if (typeof xForwardedFor === 'string' && xForwardedFor.trim().length > 0) {
        const ips = xForwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)

        if (ips.length > 0) {
            return ips[0]
        }
    }

    // Fall back to req.ip
    if (typeof req.ip === 'string' && req.ip.trim().length > 0) {
        return req.ip.trim()
    }

    throw new Error('IP address not found in request')
}
