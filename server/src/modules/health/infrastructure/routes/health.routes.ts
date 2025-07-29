import { FastifyInstance } from 'fastify'

// Prefix: /api/health
const healthRoutes = async (app: FastifyInstance) => {
    app.get('/', {
        config: {
            allowGuest: true
        }
    }, async () => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        }
    })
}

export default healthRoutes