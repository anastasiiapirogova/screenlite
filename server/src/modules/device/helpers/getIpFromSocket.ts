import { Socket } from 'socket.io'

export const getIpFromSocket = (socket: Socket): string => {
    // Check for X-Forwarded-For header
    const xForwardedFor = socket.handshake.headers['x-forwarded-for']
    let publicIp: string | undefined

    if (typeof xForwardedFor === 'string') {
        publicIp = xForwardedFor.split(',')[0].trim()
    }

    // Fallback to socket address if header is not present
    if (!publicIp) {
        publicIp = socket.handshake.address
    }

    if (publicIp.startsWith('::ffff:')) {
        publicIp = publicIp.substring(7)
    }

    if (publicIp === '::1') {
        publicIp = '127.0.0.1'
    }

    return publicIp
}
