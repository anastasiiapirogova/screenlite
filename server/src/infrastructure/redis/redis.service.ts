import { Redis } from 'ioredis'

export class RedisService {
    private clients: Map<string, Redis> = new Map()

    registerClient(clientName: string, client: Redis): void {
        if (this.clients.has(clientName)) {
            throw new Error(`Redis client "${clientName}" already exists`)
        }

        client.on('error', (err) => this.handleError(clientName, err))
        
        this.clients.set(clientName, client)
    }

    getClient(clientName: string = 'default'): Redis {
        const client = this.clients.get(clientName)

        if (!client) throw new Error(`Redis client "${clientName}" not found`)
        return client
    }

    async check(): Promise<boolean> {
        try {
            await Promise.all(
                Array.from(this.clients.values()).map(client => client.ping())
            )
            return true
        } catch {
            return false
        }
    }

    async destroyClient(clientName: string): Promise<void> {
        const client = this.clients.get(clientName)

        if (client) {
            await client.quit()
            this.clients.delete(clientName)
        }
    }

    async destroy(): Promise<void> {
        await Promise.all(
            Array.from(this.clients.values()).map(client => client.quit())
        )
        this.clients.clear()
    }

    private handleError(clientName: string, err: Error): void {
        console.error(`Redis client "${clientName}" error:`, err)
    }
}