import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import WorkspaceUserInvitationController from '@/modules/workspace/modules/workspaceUserInvitation/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

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

// TODO: Add security checks for these routes
createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/invitations/:workspaceUserInvitationId/accept',
    handler: WorkspaceUserInvitationController.acceptUserWorkspaceInvitation
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/invitations/:workspaceUserInvitationId/cancel',
    handler: WorkspaceUserInvitationController.cancelUserWorkspaceInvitation
})