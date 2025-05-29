import { Request } from 'express'

export const getIpAndUserAgent = (req: Request) => {
    let ipAddress: string = ''

    const xForwardedFor = req.headers['x-forwarded-for']

    if (typeof xForwardedFor === 'string' && xForwardedFor.length > 0) {
        ipAddress = xForwardedFor.split(',')[0].trim()
    } else if (typeof req.ip === 'string' && req.ip.length > 0) {
        ipAddress = req.ip
    } else {
        ipAddress = '127.0.0.1'
    }

    if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.substring(7)
    }

    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1'
    }

    const userAgent = req.get('User-Agent') || ''

    return { ipAddress, userAgent }
}