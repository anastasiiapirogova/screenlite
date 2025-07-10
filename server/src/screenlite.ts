import { GracefulShutdown } from './types.ts'
import { initPrisma } from './config/prisma.ts'
import { initSocketIo } from './controllers/socket.ts'
import { closeWorkers } from '@/bullmq/workers.ts'
import { server } from '@/config/server.ts'
import { MailService } from '@/services/mail/MailService.ts'
import './config/rateLimiter.ts'
import './config/storage.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}

class Screenlite {
    private isShuttingDown = false
    private readonly port: number

    constructor(port: number = 3000) {
        this.port = port
        this.setupGracefulShutdown()
    }

    async bootstrap(): Promise<void> {
        try {
            console.log('Starting Screenlite...')
            
            await this.initializeDatabase()
            await this.initializeMailService()
            this.initializeSocketIo()
            await this.startServer()
            
            console.log('Screenlite bootstrap completed successfully')
        } catch (error) {
            console.error('Screenlite bootstrap failed:', error)
            await this.shutdown(1)
        }
    }

    private async initializeDatabase(): Promise<void> {
        console.log('Initializing database connection...')
        await initPrisma()
        console.log('Database connection established')
    }

    private async initializeMailService(): Promise<void> {
        console.log('Initializing mail service...')
        const mailService = MailService.getInstance()
        const isConnected = await mailService.verifyConnection()
        
        if (isConnected) {
            console.log('Mail service connection verified')
        } else {
            console.warn('Mail service connection failed - emails may not be sent')
        }
    }

    private initializeSocketIo(): void {
        console.log('Initializing Socket.IO...')
        initSocketIo(server)
        console.log('Socket.IO initialized')
    }

    private async startServer(): Promise<void> {
        console.log(`Starting HTTP server on port ${this.port}...`)
        
        return new Promise((resolve, reject) => {
            server.listen(this.port, () => {
                console.log(`HTTP server running on port ${this.port}`)
                resolve()
            })

            server.on('error', (error) => {
                console.error('Server failed to start:', error)
                reject(error)
            })
        })
    }

    private setupGracefulShutdown(): void {
        const gracefulShutdown: GracefulShutdown = async (signal) => {
            if (this.isShuttingDown) {
                console.log('Shutdown already in progress, ignoring signal:', signal)
                return
            }

            this.isShuttingDown = true
            console.log(`Received ${signal}, initiating graceful shutdown...`)
            
            try {
                await this.shutdown(0)
            } catch (error) {
                console.error('Error during graceful shutdown:', error)
                process.exit(1)
            }
        }

        process.on('SIGINT', () => gracefulShutdown('SIGINT'))
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        
        process.on('uncaughtException', async (error) => {
            console.error('Uncaught Exception:', error)
            await this.shutdown(1)
        })

        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason)
            await this.shutdown(1)
        })
    }

    private async shutdown(exitCode: number): Promise<void> {
        try {
            console.log('Closing Screenlite components...')
            
            await closeWorkers()
            console.log('Workers closed')
            
            server.close(() => {
                console.log('HTTP server closed')
                console.log('Screenlite shutdown completed')
                process.exit(exitCode)
            })

            setTimeout(() => {
                console.error('Graceful shutdown timeout, forcing exit')
                process.exit(exitCode)
            }, 10000)

        } catch (error) {
            console.error('Error during shutdown:', error)
            process.exit(exitCode)
        }
    }
}

const screenlite = new Screenlite()

screenlite.bootstrap().catch((error) => {
    console.error('Failed to start Screenlite:', error)
    process.exit(1)
})