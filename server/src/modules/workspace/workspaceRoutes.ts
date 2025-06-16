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
import FileUploadController from '@modules/workspace/modules/fileUpload/controllers/index.js'
import { enforceWorkspacePolicy } from 'middlewares/enforceWorkspacePolicy.js'
import { WORKSPACE_PERMISSIONS } from './accessControl/permissions.js'

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

// Screens
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

// Playlists
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

// Playlist Layouts
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

// Playlist Schedules
createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlistSchedules',
    handler: PlaylistScheduleController.createPlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.updatePlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.deletePlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

// Files
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files',
    handler: FileController.getWorkspaceFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions',
    handler: FileUploadController.createFileUploadSession,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions/:fileUploadSessionId/cancel',
    handler: FileUploadController.cancelFileUploading,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/files/uploadSessions/:fileUploadSessionId/uploadPart',
    handler: FileController.uploadFilePart,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/move',
    handler: FileController.moveFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/delete',
    handler: FileController.softDeleteFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/restore',
    handler: FileController.restoreFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/emptyTrash',
    handler: FileController.emptyTrash,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/forceDelete',
    handler: FileController.forceDeleteFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})

// Folders
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders',
    handler: FileController.getWorkspaceFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders/:folderId',
    handler: FileController.getFolder,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders',
    handler: FileController.createFolder,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.folder.create })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/move',
    handler: FileController.moveFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.folder.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/delete',
    handler: FileController.softDeleteFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/restore',
    handler: FileController.restoreFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/forceDelete',
    handler: FileController.forceDeleteFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})

// Members and Invitations
createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/members',
    handler: MemberController.members,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.member.view })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/members/:userId',
    handler: MemberController.updateMember,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.member.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/leave',
    handler: MemberController.leaveWorkspace,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.workspace.leave })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/members/:userId/remove',
    handler: MemberController.removeMember,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.invitation.create })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/invitations',
    handler: WorkspaceUserInvitationController.workspaceUserInvitations,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.invitation.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/invitations',
    handler: WorkspaceUserInvitationController.inviteUserToWorkspace,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.invitation.create })
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/invitations/:workspaceUserInvitationId',
    handler: WorkspaceUserInvitationController.deleteUserWorkspaceInvitation,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.invitation.create })
})