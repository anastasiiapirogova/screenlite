import { workspaceUpdateMulterMiddleware } from '@config/multer.js'
import { workspaceMiddleware } from 'middlewares/workspaceMiddleware.js'
import { createRoute, createWorkspaceRoute, HttpMethod } from './utils.js'

import FileController from '@modules/file/controllers/index.js'
import MemberController from '@modules/member/controllers/index.js'
import PlaylistController from '@modules/playlist/controllers/index.js'
import PlaylistLayoutController from '@modules/playlistLayout/controllers/index.js'
import PlaylistScheduleController from '@modules/playlistSchedule/controllers/index.js'
import ScreenController from '@modules/screen/controllers/index.js'
import WorkspaceController from '@modules/workspace/controllers/index.js'
import WorkspaceUserInvitationController from '@modules/workspaceUserInvitation/controllers/index.js'

// Workspace
createRoute(HttpMethod.POST, '/workspaces', WorkspaceController.createWorkspace)
createWorkspaceRoute(HttpMethod.GET, '/', WorkspaceController.getWorkspace)
createRoute(HttpMethod.GET, '/workspaces/bySlug/:workspaceSlug', WorkspaceController.getWorkspace, workspaceMiddleware)
createWorkspaceRoute(HttpMethod.PATCH, '/workspaces/:workspaceId', WorkspaceController.updateWorkspace, workspaceUpdateMulterMiddleware)
createWorkspaceRoute(HttpMethod.GET, '/entityCounts', WorkspaceController.getWorkspaceEntityCounts)

// Screens
createWorkspaceRoute(HttpMethod.GET, '/screens', ScreenController.workspaceScreens)
createWorkspaceRoute(HttpMethod.POST, '/screens', ScreenController.createScreen)
createWorkspaceRoute(HttpMethod.GET, '/screens/:screenId', ScreenController.screen)
createWorkspaceRoute(HttpMethod.DELETE, '/screens', ScreenController.deleteScreens)
createWorkspaceRoute(HttpMethod.POST, '/screens/:screenId/connectDevice', ScreenController.connectDevice)
createWorkspaceRoute(HttpMethod.POST, '/screens/:screenId/disconnectDevice', ScreenController.disconnectDevice)
createWorkspaceRoute(HttpMethod.GET, '/screens/:screenId/playlists', ScreenController.screenPlaylists)

// Playlists
createWorkspaceRoute(HttpMethod.GET, '/playlists', PlaylistController.getWorkspacePlaylists)
createWorkspaceRoute(HttpMethod.POST, '/playlists', PlaylistController.createPlaylist)
createWorkspaceRoute(HttpMethod.GET, '/playlists/:playlistId', PlaylistController.getPlaylist)
createWorkspaceRoute(HttpMethod.PATCH, '/playlists/:playlistId', PlaylistController.updatePlaylist)
createWorkspaceRoute(HttpMethod.POST, '/playlists/:playlistId/copy', PlaylistController.copyPlaylist)
createWorkspaceRoute(HttpMethod.PUT, '/playlists/:playlistId/layout', PlaylistController.changePlaylistLayout)
createWorkspaceRoute(HttpMethod.DELETE, '/playlists', PlaylistController.softDeletePlaylists)
createWorkspaceRoute(HttpMethod.POST, '/playlists/restore', PlaylistController.restorePlaylists)
createWorkspaceRoute(HttpMethod.GET, '/playlists/:playlistId/screens', PlaylistController.getPlaylistScreens)
createWorkspaceRoute(HttpMethod.POST, '/playlists/:playlistId/screens', PlaylistController.addScreensToPlaylist)
createWorkspaceRoute(HttpMethod.DELETE, '/playlists/:playlistId/screens', PlaylistController.removeScreensFromPlaylist)
createWorkspaceRoute(HttpMethod.GET, '/playlists/:playlistId/items', PlaylistController.getPlaylistItems)
createWorkspaceRoute(HttpMethod.PUT, '/playlists/:playlistId/items', PlaylistController.updatePlaylistItems)

// Playlist Layouts
createWorkspaceRoute(HttpMethod.GET, '/playlistLayouts', PlaylistLayoutController.getWorkspacePlaylistLayouts)
createWorkspaceRoute(HttpMethod.POST, '/playlistLayouts', PlaylistLayoutController.createPlaylistLayout)
createWorkspaceRoute(HttpMethod.GET, '/playlistLayouts/:playlistLayoutId', PlaylistLayoutController.getPlaylistLayout)
createWorkspaceRoute(HttpMethod.PATCH, '/playlistLayouts/:playlistLayoutId', PlaylistLayoutController.updatePlaylistLayout)
createWorkspaceRoute(HttpMethod.DELETE, '/playlistLayouts/:playlistLayoutId', PlaylistLayoutController.deletePlaylistLayout)
createWorkspaceRoute(HttpMethod.GET, '/playlistLayouts/:playlistLayoutId/playlists', PlaylistLayoutController.getPlaylistLayoutPlaylists)

// Playlist Schedules
createWorkspaceRoute(HttpMethod.POST, '/playlistSchedules', PlaylistScheduleController.createPlaylistSchedule)
createWorkspaceRoute(HttpMethod.PATCH, '/playlistSchedules/:playlistScheduleId', PlaylistScheduleController.updatePlaylistSchedule)
createWorkspaceRoute(HttpMethod.DELETE, '/playlistSchedules/:playlistScheduleId', PlaylistScheduleController.deletePlaylistSchedule)

// Files
createWorkspaceRoute(HttpMethod.GET, '/files', FileController.getWorkspaceFiles)
createWorkspaceRoute(HttpMethod.POST, '/files/uploadSession', FileController.createFileUploadSession)
createWorkspaceRoute(HttpMethod.POST, '/files/cancelUploading', FileController.cancelFileUploading)
createWorkspaceRoute(HttpMethod.PUT, '/files/upload', FileController.uploadFilePart)
createWorkspaceRoute(HttpMethod.POST, '/files/move', FileController.moveFiles)
createWorkspaceRoute(HttpMethod.DELETE, '/files', FileController.softDeleteFiles)

// Folders
createWorkspaceRoute(HttpMethod.GET, '/folders', FileController.getWorkspaceFolders)
createWorkspaceRoute(HttpMethod.GET, '/folders/:folderId', FileController.getFolder)
createWorkspaceRoute(HttpMethod.POST, '/folders', FileController.createFolder)
createWorkspaceRoute(HttpMethod.POST, '/folders/move', FileController.moveFolders)
createWorkspaceRoute(HttpMethod.DELETE, '/folders', FileController.softDeleteFolders)

// Members and Invitations
createWorkspaceRoute(HttpMethod.GET, '/members', MemberController.getWorkspaceMembers)
createWorkspaceRoute(HttpMethod.GET, '/invitations', WorkspaceUserInvitationController.getWorkspaceUserInvitations)