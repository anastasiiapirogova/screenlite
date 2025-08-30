import { FastifyInstance } from 'fastify'
import { createWorkspaceRoute } from './create-workspace.route.ts'
import { deleteWorkspaceRoute } from './delete-workspace.route.ts'
import { leaveWorkspaceRoute } from './leave-workspace.route.ts'
import { getWorkspaceIdBySlugRoute } from './get-workspace-id-by-slug.route.ts'

// Prefix: /api/workspaces
const routes = async (fastify: FastifyInstance) => {
    await Promise.all([
        createWorkspaceRoute(fastify),
        deleteWorkspaceRoute(fastify),
        leaveWorkspaceRoute(fastify),
        getWorkspaceIdBySlugRoute(fastify),
    ])
}

export default routes