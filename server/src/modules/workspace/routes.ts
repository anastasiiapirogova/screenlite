import { workspaceUpdateMulterMiddleware } from '@/config/multer.ts'
import { workspaceMiddleware } from '@/middlewares/workspaceMiddleware.ts'
import { createRoute, createWorkspaceRoute, HttpMethod } from '../../routes/utils.ts'
import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import { WORKSPACE_PERMISSIONS } from './accessControl/permissions.ts'

import WorkspaceController from '@/modules/workspace/controllers/index.ts'

import '@/modules/workspace/modules/file/routes.ts'
import '@/modules/workspace/modules/folder/routes.ts'
import '@/modules/workspace/modules/fileUpload/routes.ts'
import '@/modules/workspace/modules/member/routes.ts'
import '@/modules/workspace/modules/workspaceUserInvitation/routes.ts'
import '@/modules/workspace/modules/playlist/routes.ts'
import '@/modules/workspace/modules/playlistLayout/routes.ts'
import '@/modules/workspace/modules/playlistSchedule/routes.ts'
import '@/modules/workspace/modules/screen/routes.ts'

// Workspace
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