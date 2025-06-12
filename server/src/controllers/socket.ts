import { Server as SocketServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisClient } from '@config/redis.js'
import { handleDeviceData } from '../modules/device/controllers/handleDeviceData.js'
import { getDeviceSocketConnectionInfoByToken, removeDeviceSocketConnectionInfoBySocketId, storeDeviceSocketConnectionInfo } from '../modules/device/utils/deviceSocketConnection.js'
import { setDeviceOnlineStatus } from '@modules/device/utils/setDeviceOnlineStatus.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'

let io: SocketServer

const redis = getRedisClient()

export const initSocketIo = (server: HTTPServer) => {
    const pubClient = redis.duplicate()
    const subClient = pubClient.duplicate()

    io = new SocketServer(server, {
        cors: {
            origin: '*',
            methods: ['GET'],
            credentials: true,
        },
        transports: ['websocket'],
        adapter: createAdapter(pubClient, subClient)
    })

    const deviceNamespace = io.of('/devices')

    deviceNamespace.on('connection', (socket) => {
        socket.on('deviceData', async (data) => {
            const result = await handleDeviceData(data, socket)

            if (!result) return

            const { token } = result

            const hasAlreadyBeenConnected = await getDeviceSocketConnectionByToken(token)

            await storeDeviceSocketConnectionInfo(token, socket)

            if (!hasAlreadyBeenConnected) {
                setDeviceOnlineStatus(token, true)

                addSendNewStateToDeviceJob(token)
            }
        })

        socket.on('disconnect', async () => {
            const token = await removeDeviceSocketConnectionInfoBySocketId(socket.id)

            if (token) {
                setDeviceOnlineStatus(token, false)
            }
        })
    })
}

export const getIoInstance = () => io

export const getDeviceSocketConnectionByToken = async (token: string) => {
    const id = await getDeviceSocketConnectionInfoByToken(token)

    if (!id) return null

    return io.of('/devices').sockets.get(id)
}