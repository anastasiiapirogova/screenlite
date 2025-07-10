import { Server as SocketServer, Socket, Namespace } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisClient } from '@/config/redis.ts'
import { handleDeviceData } from '../modules/device/controllers/handleDeviceData.ts'
import { getDeviceSocketConnectionInfoByToken, removeDeviceSocketConnectionInfoBySocketId, storeDeviceSocketConnectionInfo } from '../modules/device/utils/deviceSocketConnection.ts'
import { DeviceJobProducer } from '@/bullmq/producers/DeviceJobProducer.ts'

class DeviceConnectionManager {
    private deviceNamespace: Namespace

    constructor(io: SocketServer) {
        this.deviceNamespace = io.of('/devices')
        this.setupEventHandlers()
    }

    private setupEventHandlers(): void {
        this.deviceNamespace.on('connection', (socket: Socket) => {
            this.handleConnection(socket)
        })
    }

    private async handleConnection(socket: Socket): Promise<void> {
        socket.on('deviceData', async (data) => {
            await this.handleDeviceData(socket, data)
        })

        socket.on('disconnect', async () => {
            await this.handleDisconnect(socket)
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })
    }

    private async handleDeviceData(socket: Socket, data: unknown): Promise<void> {
        try {
            const result = await handleDeviceData(data, socket)

            if (!result) return

            const { token } = result

            await this.processDeviceConnection(token, socket)
        } catch (error) {
            console.error('Error handling device data:', error)
            socket.emit('error', { message: 'Failed to process device data' })
        }
    }

    private async processDeviceConnection(token: string, socket: Socket): Promise<void> {
        const hasAlreadyBeenConnected = await this.getDeviceSocketConnectionByToken(token)

        await storeDeviceSocketConnectionInfo(token, socket)

        if (!hasAlreadyBeenConnected) {
            await this.initializeNewDeviceConnection(token)
        }
    }

    private async initializeNewDeviceConnection(token: string): Promise<void> {
        try {
            await DeviceJobProducer.queueSendNewStateToDeviceJob(token)
        } catch (error) {
            console.error('Error initializing device connection:', error)
        }
    }

    private async handleDisconnect(socket: Socket): Promise<void> {
        try {
            await removeDeviceSocketConnectionInfoBySocketId(socket.id)
        } catch (error) {
            console.error('Error handling disconnect:', error)
        }
    }

    public async getDeviceSocketConnectionByToken(token: string): Promise<Socket | null> {
        try {
            const id = await getDeviceSocketConnectionInfoByToken(token)

            if (!id) return null

            return this.deviceNamespace.sockets.get(id) || null
        } catch (error) {
            console.error('Error getting device socket connection:', error)
            return null
        }
    }

    public getNamespace(): Namespace {
        return this.deviceNamespace
    }
}

class SocketIOServer {
    private io: SocketServer
    private deviceConnectionManager: DeviceConnectionManager

    constructor(server: HTTPServer) {
        this.io = this.createSocketServer(server)
        this.deviceConnectionManager = new DeviceConnectionManager(this.io)
    }

    private createSocketServer(server: HTTPServer): SocketServer {
        const redis = getRedisClient()
        const pubClient = redis.duplicate()
        const subClient = pubClient.duplicate()

        return new SocketServer(server, {
            cors: {
                origin: '*',
                methods: ['GET'],
                credentials: true,
            },
            transports: ['websocket'],
            adapter: createAdapter(pubClient, subClient)
        })
    }

    public getIoInstance(): SocketServer {
        return this.io
    }

    public getDeviceConnectionManager(): DeviceConnectionManager {
        return this.deviceConnectionManager
    }
}

let socketServer: SocketIOServer

export const initSocketIo = (server: HTTPServer): void => {
    socketServer = new SocketIOServer(server)
}

export const getIoInstance = (): SocketServer => {
    if (!socketServer) {
        throw new Error('Socket.IO server not initialized. Call initSocketIo first.')
    }
    return socketServer.getIoInstance()
}

export const getDeviceSocketConnectionByToken = async (token: string): Promise<Socket | null> => {
    if (!socketServer) {
        throw new Error('Socket.IO server not initialized. Call initSocketIo first.')
    }
    return socketServer.getDeviceConnectionManager().getDeviceSocketConnectionByToken(token)
}