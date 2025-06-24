import { Socket } from 'socket.io'

export const getIpFromSocket = (socket: Socket): string => {
    // Check for X-Forwarded-For header (may contain multiple IPs)
    const xForwardedFor = socket.handshake.headers['x-forwarded-for']

    if (typeof xForwardedFor === 'string' && xForwardedFor.trim().length > 0) {
        const ips = xForwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)

        if (ips.length > 0) {
            return normalizeIpAddress(ips[0])
        }
    }

    // Fallback to socket address if header is not present
    const socketAddress = socket.handshake.address

    if (typeof socketAddress === 'string' && socketAddress.trim().length > 0) {
        return normalizeIpAddress(socketAddress.trim())
    }

    throw new Error('IP_ADDRESS_NOT_FOUND')
}

const normalizeIpAddress = (ip: string): string => {
    // Handle IPv6 mapped IPv4 addresses (::ffff:192.168.1.1)
    if (ip.startsWith('::ffff:')) {
        return ip.substring(7)
    }

    // Handle IPv6 localhost
    if (ip === '::1') {
        return '127.0.0.1'
    }

    return ip
}
