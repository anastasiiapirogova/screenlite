import { FastifyInstance } from 'fastify'
import { requestAccountDeletionRoute } from './request-account-deletion.route.ts'
import { cancelAccountDeletionRoute } from './cancel-account-deletion.route.ts'

// Prefix: /api/user
const userRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        requestAccountDeletionRoute(fastify),
        cancelAccountDeletionRoute(fastify),
    ])
}

export default userRoutes