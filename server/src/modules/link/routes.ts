import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'
import LinkController from './controllers/index.ts'
import { enforceWorkspacePolicy } from '@workspaceModules/middlewares/enforceWorkspacePolicy.ts'

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/links',
    handler: LinkController.createLink,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.link.create })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/links',
    handler: LinkController.getWorkspaceLinks,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.link.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/links/:linkId',
    handler: LinkController.getLink,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.link.view })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/links/:linkId',
    handler: LinkController.updateLink,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.link.update })
})