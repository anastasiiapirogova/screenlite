import { Request } from 'express'

export class IdleTimeoutManager {
    private timeout: NodeJS.Timeout | null = null
    private isComplete = false

    constructor(private readonly req: Request, private readonly maxIdleTime: number) {}

    reset(): void {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        
        if (!this.isComplete) {
            this.timeout = setTimeout(() => {
                this.req.destroy(new Error('UPLOAD_IDLE_TIMEOUT'))
            }, this.maxIdleTime)
        }
    }

    cleanup(): void {
        this.isComplete = true
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
    }

    setupEventListeners(): void {
        this.req.on('data', () => {
            this.reset()
        })

        this.req.on('end', () => {
            this.cleanup()
        })

        this.reset()
    }
}
