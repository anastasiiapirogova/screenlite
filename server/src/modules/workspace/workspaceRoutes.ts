import { workspaceUpdateMulterMiddleware } from '@config/multer.js'
import { workspaceMiddleware } from 'middlewares/workspaceMiddleware.js'
import { createRoute, createWorkspaceRoute, HttpMethod } from '../../routes/utils.js'

import FileController from '@modules/workspace/modules/file/controllers/index.js'
import MemberController from '@modules/workspace/modules/member/controllers/index.js'
import PlaylistController from '@modules/workspace/modules/playlist/controllers/index.js'
import PlaylistLayoutController from '@modules/workspace/modules/playlistLayout/controllers/index.js'
import PlaylistScheduleController from '@modules/workspace/modules/playlistSchedule/controllers/index.js'
import ScreenController from '@modules/workspace/modules/screen/controllers/index.js'
import WorkspaceController from '@modules/workspace/controllers/index.js'
import WorkspaceUserInvitationController from '@modules/workspace/modules/workspaceUserInvitation/controllers/index.js'

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
    additionalMiddleware: [workspaceMiddleware]
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/entityCounts',
    handler: WorkspaceController.getWorkspaceEntityCounts
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/delete',
    handler: WorkspaceController.deleteWorkspace
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/',
    handler: WorkspaceController.updateWorkspace,
    additionalMiddleware: [workspaceUpdateMulterMiddleware]
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/',
    handler: WorkspaceController.getWorkspace
})

// Screens
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens',
    handler: ScreenController.workspaceScreens
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens',
    handler: ScreenController.createScreen
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/delete',
    handler: ScreenController.deleteScreens
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens/:screenId',
    handler: ScreenController.screen
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/:screenId/connectDevice',
    handler: ScreenController.connectDevice
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/screens/:screenId/disconnectDevice',
    handler: ScreenController.disconnectDevice
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/screens/:screenId/playlists',
    handler: ScreenController.screenPlaylists
})

// Playlists
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists',
    handler: PlaylistController.workspacePlaylists
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists',
    handler: PlaylistController.createPlaylist
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId',
    handler: PlaylistController.playlist
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlists/:playlistId',
    handler: PlaylistController.updatePlaylist
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/copy',
    handler: PlaylistController.copyPlaylist
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/playlists/:playlistId/layout',
    handler: PlaylistController.changePlaylistLayout
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/delete',
    handler: PlaylistController.softDeletePlaylists
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/restore',
    handler: PlaylistController.restorePlaylists
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId/screens',
    handler: PlaylistController.getPlaylistScreens
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/screens',
    handler: PlaylistController.addScreensToPlaylist
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/:playlistId/removeScreens',
    handler: PlaylistController.removeScreensFromPlaylist
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlists/:playlistId/items',
    handler: PlaylistController.getPlaylistItems
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/playlists/:playlistId/items',
    handler: PlaylistController.updatePlaylistItems
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/emptyTrash',
    handler: PlaylistController.emptyTrash
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlists/forceDelete',
    handler: PlaylistController.forceDeletePlaylists
})

// Playlist Layouts
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts',
    handler: PlaylistLayoutController.getWorkspacePlaylistLayouts
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlistLayouts',
    handler: PlaylistLayoutController.createPlaylistLayout
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts/:playlistLayoutId/playlists',
    handler: PlaylistLayoutController.getPlaylistLayoutPlaylists
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.getPlaylistLayout
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.updatePlaylistLayout
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/playlistLayouts/:playlistLayoutId',
    handler: PlaylistLayoutController.deletePlaylistLayout
})

// Playlist Schedules
createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlistSchedules',
    handler: PlaylistScheduleController.createPlaylistSchedule
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.updatePlaylistSchedule
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.deletePlaylistSchedule
})

// Files
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files',
    handler: FileController.getWorkspaceFiles
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions',
    handler: FileController.createFileUploadSession
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions/:fileUploadSessionId/cancel',
    handler: FileController.cancelFileUploading
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/files/uploadSessions/:fileUploadSessionId/uploadPart',
    handler: FileController.uploadFilePart
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/move',
    handler: FileController.moveFiles
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/delete',
    handler: FileController.softDeleteFiles
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/restore',
    handler: FileController.restoreFiles
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/emptyTrash',
    handler: FileController.emptyTrash
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/forceDelete',
    handler: FileController.forceDeleteFiles
})

// Folders
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders',
    handler: FileController.getWorkspaceFolders
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders/:folderId',
    handler: FileController.getFolder
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders',
    handler: FileController.createFolder
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/move',
    handler: FileController.moveFolders
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/delete',
    handler: FileController.softDeleteFolders
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/restore',
    handler: FileController.restoreFolders
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/forceDelete',
    handler: FileController.forceDeleteFolders
})

// Members and Invitations
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/members',
    handler: MemberController.members
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/members/:userId',
    handler: MemberController.updateMember
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/leave',
    handler: MemberController.leaveWorkspace
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/members/:userId/remove',
    handler: MemberController.removeMember
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/invitations',
    handler: WorkspaceUserInvitationController.workspaceUserInvitations
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/invitations',
    handler: WorkspaceUserInvitationController.inviteUserToWorkspace
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/invitations/:workspaceUserInvitationId',
    handler: WorkspaceUserInvitationController.deleteUserWorkspaceInvitation
})