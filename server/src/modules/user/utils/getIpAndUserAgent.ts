import { Request } from 'express'

export const getIpAndUserAgent = (req: Request) => {
    let ipAddress = typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]
        : req.ip

    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1'
    }

    const userAgent = req.get('User-Agent') || ''

    return { ipAddress, userAgent }
}