import { FastifyInstance } from 'fastify'

// Prefix: /api/health
export function healthRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        return { 
            status: 'ok',
            timestamp: new Date().toISOString(),
        }
    })
}