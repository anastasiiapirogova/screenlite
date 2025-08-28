import { FastifyInstance } from 'fastify'
import { requestAccountDeletionRoute } from './request-account-deletion.route.ts'
import { cancelAccountDeletionRoute } from './cancel-account-deletion.route.ts'
import { updateProfileRoute } from './update-profile.route.ts'
import { changePasswordRoute } from './change-password.route.ts'

// Prefix: /api/users
const userRoutes = async (fastify: FastifyInstance) => {
    await Promise.all([
        requestAccountDeletionRoute(fastify),
        cancelAccountDeletionRoute(fastify),
        updateProfileRoute(fastify),
        changePasswordRoute(fastify),
    ])
}

export default userRoutes