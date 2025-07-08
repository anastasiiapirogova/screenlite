import { workspaceUpdateMulterMiddleware } from '@/config/multer.ts'
import { workspaceMiddleware } from '@workspaceModules/middlewares/workspaceMiddleware.ts'
import { createRoute, createWorkspaceRoute, HttpMethod } from '../../routes/utils.ts'
import { enforceWorkspacePolicy } from '@workspaceModules/middlewares/enforceWorkspacePolicy.ts'
import { WORKSPACE_PERMISSIONS } from './accessControl/permissions.ts'

import WorkspaceController from '@/modules/workspace/controllers/index.ts'

createRoute({
    method: HttpMethod.POST,
    path: '/workspaces',
    handler: WorkspaceController.createWorkspace
})

createRoute({
    method: HttpMethod.GET,
    path: '/workspaces/bySlug/:workspaceSlug',
    handler: WorkspaceController.getWorkspace,
    additionalMiddleware: [
        workspaceMiddleware,
        enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.view })
    ]
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/entityCounts',
    handler: WorkspaceController.getWorkspaceEntityCounts,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/delete',
    handler: WorkspaceController.deleteWorkspace,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.delete })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/',
    handler: WorkspaceController.updateWorkspace,
    additionalMiddleware: [workspaceUpdateMulterMiddleware],
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.update })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/',
    handler: WorkspaceController.getWorkspace,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.view })
})