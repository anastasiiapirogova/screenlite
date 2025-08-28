import { FastifyInstance } from 'fastify'
import { createWorkspaceRoute } from './create-workspace.route.ts'

// Prefix: /api/workspaces
const routes = async (fastify: FastifyInstance) => {
    await Promise.all([
        createWorkspaceRoute(fastify),
    ])
}

export default routes