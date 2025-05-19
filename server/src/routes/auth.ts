import express from 'express'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
import { asyncHandler } from '@utils/asyncHandler.js'
import { me } from '@modules/auth/me.js'
import { logout } from '@modules/auth/logout.js'
import { activeSessions } from '@modules/session/activeSessions.js'
import { revokeSession } from '@modules/session/revokeSession.js'
import { changePassword } from '@modules/user/changePassword.js'
import { deleteUser } from '@modules/user/deleteUser.js'
import { userWorkspaces } from '@modules/user/userWorkspaces.js'
import { createWorkspace } from '@modules/workspace/createWorkspace.js'
import { getWorkspace } from '@modules/workspace/getWorkspace.js'
import { updateWorkspace } from '@modules/workspace/updateWorkspace.js'
import { getWorkspaceScreens } from '@modules/screen/getWorkspaceScreens.js'
import { getWorkspacePlaylists } from '@modules/playlist/getWorkspacePlaylists.js'
import { getWorkspacePlaylistLayouts } from '@modules/playlistLayout/getWorkspacePlaylistLayouts.js'
import { createScreen } from '@modules/screen/createScreen.js'
import { getScreen } from '@modules/screen/getScreen.js'
import { connectDevice } from '@modules/screen/connectDevice.js'
import { disconnectDevice } from '@modules/screen/disconnectDevice.js'
import { getScreenPlaylists } from '@modules/screen/getScreenPlaylists.js'
import { deleteScreens } from '@modules/screen/deleteScreens.js'
import { createPlaylist } from '@modules/playlist/createPlaylist.js'
import { getPlaylist } from '@modules/playlist/getPlaylist.js'
import { addScreensToPlaylist } from '@modules/playlist/addScreensToPlaylist.js'
import { removeScreensFromPlaylist } from '@modules/playlist/removeScreensFromPlaylist.js'
import { getPlaylistScreens } from '@modules/playlist/getPlaylistScreens.js'
import { deletePlaylists } from '@modules/playlist/deletePlaylists.js'
import { getPlaylistItems } from '@modules/playlist/getPlaylistItems.js'
import { getPlaylistLayout } from '@modules/playlistLayout/getPlaylistLayout.js'
import { getPlaylistLayoutPlaylists } from '@modules/playlistLayout/getPlaylistLayoutPlaylists.js'
import { createPlaylistSchedule } from '@modules/playlistSchedule/createPlaylistSchedule.js'
import { updatePlaylistSchedule } from '@modules/playlistSchedule/updatePlaylistSchedule.js'
import { deletePlaylistSchedule } from '@modules/playlistSchedule/deletePlaylistSchedule.js'
import { updatePlaylistItems } from '@modules/playlist/updatePlaylistItems.js'
import { createPlaylistLayout } from '@modules/playlistLayout/createPlaylistLayout.js'
import { restorePlaylists } from '@modules/playlist/restorePlaylists.js'
import { workspaceUpdateMulterMiddleware } from '@config/multer.js'
import { copyPlaylist } from '@modules/playlist/copyPlaylist.js'
import { updatePlaylist } from '@modules/playlist/updatePlaylist.js'
import { changePlaylistLayout } from '@modules/playlist/changePlaylistLayout.js'
import { updatePlaylistLayout } from '@modules/playlistLayout/updatePlaylistLayout.js'
import { deletePlaylistLayout } from '@modules/playlistLayout/deletePlaylistLayout.js'
import { getWorkspaceEntityCounts } from '@modules/workspace/getWorkspaceEntityCounts.js'
import { getWorkspaceUserInvitations } from '@modules/workspaceUserInvitation/getWorkspaceUserInvitations.js'
import {
    cancelFileUploading,
    createFileUploadSession,
    createFolder,
    softDeleteFolders,
    getWorkspaceFiles,
    getFolder,
    getWorkspaceFolders,
    uploadFilePart,
    moveToFolder
} from '@modules/file/controllers/index.js'
import { getUserInvitations } from '@modules/workspaceUserInvitation/getUserInvitations.js'
import { getWorkspaceMembers } from '@modules/member/controllers/getWorkspaceMembers.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: any[]) => {
    router[method](path, isAuthenticated, ...middlewares, asyncHandler(handler))
}

// Auth
createRoute(HttpMethod.GET, '/auth/me', me)
createRoute(HttpMethod.POST, '/auth/logout', logout)

// User & Security
createRoute(HttpMethod.GET, '/users/:id/activeSessions', activeSessions)
createRoute(HttpMethod.GET, '/users/:id/workspaces', userWorkspaces)
createRoute(HttpMethod.GET, '/users/:id/invitations', getUserInvitations)
createRoute(HttpMethod.POST, '/users/revokeSession', revokeSession)
createRoute(HttpMethod.POST, '/users/changePassword', changePassword)
createRoute(HttpMethod.POST, '/users/delete', deleteUser)

// Workspace
createRoute(HttpMethod.POST, '/workspaces/create', createWorkspace)
createRoute(HttpMethod.POST, '/workspaces/update', updateWorkspace, [
    workspaceUpdateMulterMiddleware
])
createRoute(HttpMethod.GET, '/workspaces/:slug', getWorkspace)
createRoute(HttpMethod.GET, '/workspaces/:slug/entityCounts', getWorkspaceEntityCounts)
createRoute(HttpMethod.GET, '/workspaces/:slug/screens', getWorkspaceScreens)
createRoute(HttpMethod.GET, '/workspaces/:slug/playlists', getWorkspacePlaylists)
createRoute(HttpMethod.GET, '/workspaces/:slug/playlistLayouts', getWorkspacePlaylistLayouts)
createRoute(HttpMethod.GET, '/workspaces/:slug/files', getWorkspaceFiles)
createRoute(HttpMethod.GET, '/workspaces/:slug/invitations', getWorkspaceUserInvitations)
createRoute(HttpMethod.GET, '/workspaces/:slug/folders', getWorkspaceFolders)
createRoute(HttpMethod.GET, '/workspaces/:slug/members', getWorkspaceMembers)

// Screen
createRoute(HttpMethod.GET, '/screens/:id', getScreen)
createRoute(HttpMethod.GET, '/screens/:id/playlists', getScreenPlaylists)
createRoute(HttpMethod.POST, '/screens/create', createScreen)
createRoute(HttpMethod.POST, '/screens/delete', deleteScreens)
createRoute(HttpMethod.POST, '/screens/connectDevice', connectDevice)
createRoute(HttpMethod.POST, '/screens/disconnectDevice', disconnectDevice)

// Playlist
createRoute(HttpMethod.GET, '/playlists/:id', getPlaylist)
createRoute(HttpMethod.GET, '/playlists/:id/screens', getPlaylistScreens)
createRoute(HttpMethod.GET, '/playlists/:id/items', getPlaylistItems)
createRoute(HttpMethod.POST, '/playlists/create', createPlaylist)
createRoute(HttpMethod.POST, '/playlists/copy', copyPlaylist)
createRoute(HttpMethod.POST, '/playlists/update', updatePlaylist)
createRoute(HttpMethod.POST, '/playlists/changeLayout', changePlaylistLayout)
createRoute(HttpMethod.POST, '/playlists/delete', deletePlaylists)
createRoute(HttpMethod.POST, '/playlists/restore', restorePlaylists)
createRoute(HttpMethod.POST, '/playlists/addScreens', addScreensToPlaylist)
createRoute(HttpMethod.POST, '/playlists/updateItems', updatePlaylistItems)
createRoute(HttpMethod.POST, '/playlists/removeScreens', removeScreensFromPlaylist)

// Playlist Layout
createRoute(HttpMethod.GET, '/playlistLayouts/:id', getPlaylistLayout)
createRoute(HttpMethod.GET, '/playlistLayouts/:id/playlists', getPlaylistLayoutPlaylists)
createRoute(HttpMethod.POST, '/playlistLayouts/create', createPlaylistLayout)
createRoute(HttpMethod.POST, '/playlistLayouts/update', updatePlaylistLayout)
createRoute(HttpMethod.POST, '/playlistLayouts/delete', deletePlaylistLayout)

// Playlist Schedule
createRoute(HttpMethod.POST, '/playlistSchedules/create', createPlaylistSchedule)
createRoute(HttpMethod.POST, '/playlistSchedules/update', updatePlaylistSchedule)
createRoute(HttpMethod.POST, '/playlistSchedules/delete', deletePlaylistSchedule)

// File
createRoute(HttpMethod.POST, '/files/createUploadSession', createFileUploadSession)
createRoute(HttpMethod.POST, '/files/cancelFileUploading', cancelFileUploading)
createRoute(HttpMethod.PUT, '/files/upload', uploadFilePart)

// Folder
createRoute(HttpMethod.GET, '/files/folders/:id', getFolder)
createRoute(HttpMethod.POST, '/files/createFolder', createFolder)
createRoute(HttpMethod.POST, '/files/moveToFolder', moveToFolder)
createRoute(HttpMethod.POST, '/files/trashFolders', softDeleteFolders)

// Workspace User Invitations

export { router as authRoutes }
