import { FastifyInstance } from 'fastify'
import { getThumbnailRoute } from './get-thumbnail.route.ts'

// Prefix: /api/file-delivery
const fileDeliveryRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        getThumbnailRoute(fastify),
    ])
}

export default fileDeliveryRoutes