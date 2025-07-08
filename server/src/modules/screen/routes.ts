import { enforceWorkspacePolicy } from '@workspaceModules/middlewares/enforceWorkspacePolicy.ts'
import ScreenController from '@/modules/screen/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens',
    handler: ScreenController.workspaceScreens,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens',
    handler: ScreenController.createScreen,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.create })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/delete',
    handler: ScreenController.deleteScreens,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.delete })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens/:screenId',
    handler: ScreenController.screen,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/:screenId/connectDevice',
    handler: ScreenController.connectDevice,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.connect })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/:screenId/disconnectDevice',
    handler: ScreenController.disconnectDevice,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.connect })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens/:screenId/playlists',
    handler: ScreenController.screenPlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})