import { userUpdateMulterMiddleware } from '@config/multer.js'
import { createRoute, createUnprotectedRoute, HttpMethod } from './utils.js'

import SessionController from '@modules/session/controllers/index.js'
import UserController from '@modules/user/controllers/index.js'
import AuthController from '@modules/auth/controllers/index.js'
import WorkspaceUserInvitationController from '@modules/workspace/modules/workspaceUserInvitation/controllers/index.js'

// =======================
// Unprotected Routes
// =======================

createUnprotectedRoute({
    method: HttpMethod.GET,
    path: '/auth/me',
    handler: AuthController.me
})

createUnprotectedRoute({
    method: HttpMethod.POST,
    path: '/auth/logout',
    handler: AuthController.logout
})

createUnprotectedRoute({
    method: HttpMethod.POST,
    path: '/users/2fa/verify',
    handler: UserController.verifyTwoFa
})

// =======================
// Protected Routes (requires 2FA if enabled)
// =======================

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/sessions',
    handler: SessionController.getUserSessions
})

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/workspaces',
    handler: UserController.userWorkspaces
})

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/invitations',
    handler: WorkspaceUserInvitationController.userInvitations
})

createRoute({
    method: HttpMethod.PUT,
    path: '/users/:userId/password',
    handler: UserController.changePassword
})

createRoute({
    method: HttpMethod.POST,
    path: '/users/:userId/terminateAllSessions',
    handler: SessionController.terminateAllSessions
})

createRoute({
    method: HttpMethod.PUT,
    path: '/users/:userId/email',
    handler: UserController.forceChangeEmail
})

createRoute({
    method: HttpMethod.DELETE,
    path: '/users/:userId',
    handler: UserController.deleteUser
})

createRoute({
    method: HttpMethod.PATCH,
    path: '/users/:userId',
    handler: UserController.updateUser,
    additionalMiddleware: [userUpdateMulterMiddleware]
})

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/security/2fa/totpSetupData',
    handler: UserController.getTotpSetupData
})

createRoute({
    method: HttpMethod.POST,
    path: '/security/2fa/enable',
    handler: UserController.enableTwoFa
})

createRoute({
    method: HttpMethod.POST,
    path: '/security/2fa/disable',
    handler: UserController.disableTwoFa
})

createRoute({
    method: HttpMethod.POST,
    path: '/sessions/:sessionId/terminate',
    handler: SessionController.terminateSession
})

createRoute({
    method: HttpMethod.POST,
    path: '/invitations/:workspaceUserInvitationId/accept',
    handler: WorkspaceUserInvitationController.acceptUserWorkspaceInvitation
})

createRoute({
    method: HttpMethod.POST,
    path: '/invitations/:workspaceUserInvitationId/cancel',
    handler: WorkspaceUserInvitationController.cancelUserWorkspaceInvitation
})