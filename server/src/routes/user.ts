import { userUpdateMulterMiddleware } from '@config/multer.js'
import { createRoute, createUnprotectedRoute, HttpMethod } from './utils.js'

import SessionController from '@modules/session/controllers/index.js'
import UserController from '@modules/user/controllers/index.js'
import AuthController from '@modules/auth/controllers/index.js'
import WorkspaceUserInvitationController from '@modules/workspaceUserInvitation/controllers/index.js'

// =======================
// Unprotected Routes
// =======================

createUnprotectedRoute(HttpMethod.GET, '/auth/me', AuthController.me)
createUnprotectedRoute(HttpMethod.POST, '/auth/logout', AuthController.logout)
createUnprotectedRoute(HttpMethod.POST, '/users/2fa/verify', UserController.verifyTwoFa)

// =======================
// Protected Routes (requires 2FA if enabled)
// =======================

createRoute(HttpMethod.GET, '/users/:id/sessions', SessionController.getUserSessions)
createRoute(HttpMethod.GET, '/users/:id/workspaces', UserController.userWorkspaces)
createRoute(HttpMethod.GET, '/users/:id/invitations', WorkspaceUserInvitationController.userInvitations)
createRoute(HttpMethod.POST, '/users/:id/changePassword', UserController.changePassword)
createRoute(HttpMethod.POST, '/users/:id/terminateAllSessions', SessionController.terminateAllSessions)
createRoute(HttpMethod.POST, '/users/:id/changeEmail', UserController.forceChangeEmail)
createRoute(HttpMethod.DELETE, '/users/:id', UserController.deleteUser)
createRoute(HttpMethod.PATCH, '/users/:id', UserController.updateUser, userUpdateMulterMiddleware)

createRoute(HttpMethod.GET, '/security/2fa/totpSetupData', UserController.getTotpSetupData)
createRoute(HttpMethod.POST, '/security/2fa/enable', UserController.enableTwoFa)
createRoute(HttpMethod.POST, '/security/2fa/disable', UserController.disableTwoFa)

createRoute(HttpMethod.POST, '/sessions/:id/terminate', SessionController.terminateSession)