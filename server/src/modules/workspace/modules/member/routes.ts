import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import MemberController from '@/modules/workspace/modules/member/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

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