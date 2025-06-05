import express, { RequestHandler } from 'express'
import { asyncHandler } from '@utils/asyncHandler.js'
import {
    userUpdateMulterMiddleware,
    workspaceUpdateMulterMiddleware
} from '@config/multer.js'
import {
    authMiddleware
} from 'middlewares/index.js'
import {
    getUserSessions,
    terminateSession,
    terminateAllSessions
} from '@modules/session/controllers/index.js'
import {
    createPlaylistSchedule,
    updatePlaylistSchedule,
    deletePlaylistSchedule
} from '@modules/playlistSchedule/controllers/index.js'
import {
    getPlaylistLayout,
    getPlaylistLayoutPlaylists,
    createPlaylistLayout,
    updatePlaylistLayout,
    deletePlaylistLayout,
    getWorkspacePlaylistLayouts
} from '@modules/playlistLayout/controllers/index.js'
import {
    addScreensToPlaylist,
    changePlaylistLayout,
    copyPlaylist,
    createPlaylist,
    deletePlaylists,
    getPlaylist,
    getPlaylistItems,
    getPlaylistScreens,
    getWorkspacePlaylists,
    removeScreensFromPlaylist,
    restorePlaylists,
    updatePlaylist,
    updatePlaylistItems
} from '@modules/playlist/controllers/index.js'
import {
    me,
    logout
} from '@modules/auth/controllers/index.js'
import {
    connectDevice,
    createScreen,
    deleteScreens,
    disconnectDevice,
    getScreen,
    getScreenPlaylists,
    getWorkspaceScreens
} from '@modules/screen/controllers/index.js'
import {
    cancelFileUploading,
    createFileUploadSession,
    createFolder,
    getFolder,
    getWorkspaceFiles,
    getWorkspaceFolders,
    moveToFolder,
    softDeleteFolders,
    uploadFilePart
} from '@modules/file/controllers/index.js'
import {
    changePassword,
    deleteUser,
    updateUser,
    userWorkspaces,
    forceChangeEmail,
    getTotpSetupData,
    enableTwoFa,
    disableTwoFa,
    verifyTwoFa
} from '@modules/user/controllers/index.js'
import {
    createWorkspace,
    getWorkspace,
    getWorkspaceEntityCounts,
    updateWorkspace,
} from '@modules/workspace/controllers/index.js'
import { getWorkspaceMembers } from '@modules/member/controllers/getWorkspaceMembers.js'
import {
    getUserInvitations,
    getWorkspaceUserInvitations
} from '@modules/workspaceUserInvitation/controllers/index.js'
import { twoFactorAuthMiddleware } from 'middlewares/twoFactorAuthMiddleware.js'

const router = express.Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
}

const createRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: RequestHandler[]) => {
    router[method](path, authMiddleware, twoFactorAuthMiddleware, ...middlewares, asyncHandler(handler))
}
 
const createUnprotectedRoute = (method: HttpMethod, path: string, handler: (req: express.Request, res: express.Response) => Promise<void>, ...middlewares: RequestHandler[]) => {
    router[method](path, authMiddleware, ...middlewares, asyncHandler(handler))
}

// =======================
// Unprotected Routes
// =======================

// Authentication
createUnprotectedRoute(HttpMethod.GET, '/auth/me', me)
createUnprotectedRoute(HttpMethod.POST, '/auth/logout', logout)

// Two-Factor Authentication
createUnprotectedRoute(HttpMethod.POST, '/users/2fa/verify', verifyTwoFa)

// =======================
// Protected Routes
// =======================

// User & Security
createRoute(HttpMethod.GET, '/users/:id/sessions', getUserSessions)
createRoute(HttpMethod.GET, '/users/:id/workspaces', userWorkspaces)
createRoute(HttpMethod.GET, '/users/:id/invitations', getUserInvitations)
createRoute(HttpMethod.GET, '/users/getTotpSetupData', getTotpSetupData)
createRoute(HttpMethod.POST, '/users/changePassword', changePassword)
/**
 * TODO: Replace forceChangeEmail controller with an implementation that includes
 * email verification and requires the user's current password before changing the email.
 */
createRoute(HttpMethod.POST, '/users/changeEmail', forceChangeEmail)
createRoute(HttpMethod.POST, '/users/delete', deleteUser)
createRoute(HttpMethod.POST, '/users/update', updateUser, userUpdateMulterMiddleware)
createRoute(HttpMethod.POST, '/users/2fa/enable', enableTwoFa)
createRoute(HttpMethod.POST, '/users/2fa/disable', disableTwoFa)

// Session
createRoute(HttpMethod.POST, '/sessions/terminate', terminateSession)
createRoute(HttpMethod.POST, '/sessions/terminateAll', terminateAllSessions)

// Workspace
createRoute(HttpMethod.POST, '/workspaces/create', createWorkspace)
createRoute(HttpMethod.POST, '/workspaces/update', updateWorkspace, workspaceUpdateMulterMiddleware)
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

// File folder
createRoute(HttpMethod.GET, '/files/folders/:id', getFolder)
createRoute(HttpMethod.POST, '/files/createFolder', createFolder)
createRoute(HttpMethod.POST, '/files/moveToFolder', moveToFolder)
createRoute(HttpMethod.POST, '/files/trashFolders', softDeleteFolders)

// Workspace User Invitations

export { router as authRoutes }
