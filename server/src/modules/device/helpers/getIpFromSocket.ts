import { Socket } from 'socket.io'

export const getIpFromSocket = (socket: Socket): string => {
    let publicIp = socket.handshake.address

    if (publicIp.startsWith('::ffff:')) {
        publicIp = publicIp.substring(7)
    }

    if (publicIp === '::1') {
        publicIp = '127.0.0.1'
    }

    return publicIp
}
