import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import PlaylistLayoutController from '@/modules/workspace/modules/playlistLayout/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts',
    handler: PlaylistLayoutController.workspacePlaylistLayouts,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlistLayout.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlistLayouts',
    handler: PlaylistLayoutController.createPlaylistLayout,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlistLayout.create })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts/:playlistLayoutId/playlists',
    handler: PlaylistLayoutController.getPlaylistLayoutPlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.getPlaylistLayout,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlistLayout.view })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.updatePlaylistLayout,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlistLayout.update })
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.deletePlaylistLayout,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlistLayout.delete })
})