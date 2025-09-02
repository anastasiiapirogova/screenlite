import { FastifyInstance } from 'fastify'
import { acceptWorkspaceInvitationRoute } from './accept-workspace-invitation.route.ts'
import { rejectWorkspaceInvitationRoute } from './reject-workspace-invitation.route.ts'
import { createWorkspaceInvitationRoute } from './create-workspace-invitation.route.ts'

// Prefix: /api/workspace-invitations
const routes = async (fastify: FastifyInstance) => {
    await Promise.all([
        createWorkspaceInvitationRoute(fastify),
        acceptWorkspaceInvitationRoute(fastify),
        rejectWorkspaceInvitationRoute(fastify),
    ])
}

export default routes