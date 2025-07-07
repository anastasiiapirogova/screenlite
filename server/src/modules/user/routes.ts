import { userUpdateMulterMiddleware } from '@/config/multer.ts'
import UserController from '@/modules/user/controllers/index.ts'
import { createGuestRoute, createRoute, createRouteWithoutTwoFACheck, HttpMethod } from '@/routes/utils.ts'

createGuestRoute({
    method: HttpMethod.POST,
    path: '/user/verifyEmail',
    handler: UserController.verifyEmail
})

createRouteWithoutTwoFACheck({
    method: HttpMethod.POST,
    path: '/users/2fa/verify',
    handler: UserController.verifyTwoFa
})

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/workspaces',
    handler: UserController.userWorkspaces
})

createRoute({
    method: HttpMethod.GET,
    path: '/users/:userId/invitations',
    handler: UserController.workspaceUserInvitations
})

createRoute({
    method: HttpMethod.PUT,
    path: '/users/:userId/password',
    handler: UserController.changePassword
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
    path: '/users/:userId/sessions',
    handler: UserController.getSessions
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
    path: '/users/:userId/terminateAllSessions',
    handler: UserController.terminateAllSessions
})