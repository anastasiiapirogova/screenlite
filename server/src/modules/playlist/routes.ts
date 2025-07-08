import { enforceWorkspacePolicy } from '@workspaceModules/middlewares/enforceWorkspacePolicy.ts'
import PlaylistController from '@/modules/playlist/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists',
    handler: PlaylistController.workspacePlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists',
    handler: PlaylistController.createPlaylist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.create })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId',
    handler: PlaylistController.playlist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlists/:playlistId',
    handler: PlaylistController.updatePlaylist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/copy',
    handler: PlaylistController.copyPlaylist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.create })
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/playlists/:playlistId/layout',
    handler: PlaylistController.changePlaylistLayout,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/delete',
    handler: PlaylistController.softDeletePlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/restore',
    handler: PlaylistController.restorePlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.restore })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId/screens',
    handler: PlaylistController.getPlaylistScreens,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/screens',
    handler: PlaylistController.addScreensToPlaylist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/removeScreens',
    handler: PlaylistController.removeScreensFromPlaylist,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.screen.update })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId/items',
    handler: PlaylistController.getPlaylistItems,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/playlists/:playlistId/items',
    handler: PlaylistController.updatePlaylistItems,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/emptyTrash',
    handler: PlaylistController.emptyTrash,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/forceDelete',
    handler: PlaylistController.forceDeletePlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.permanentDelete })
})