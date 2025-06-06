import { UserWorkspace } from 'generated/prisma/client.js'
import { SafeUser } from 'types.js'
import { getUserWorkspacePermissions, getUserWorkspacePermissionsEager } from '../utils/getUserWorkspacePermissions.js'

export class WorkspacePolicy {
    static PERMISSIONS = {
        UPDATE_WORKSPACE: 'update_workspace',
    }

    static async canViewWorkspace(user: SafeUser, workspace: { id?: string, members?: UserWorkspace[] }): Promise<boolean> {
        if(!workspace.members) {
            return getUserWorkspacePermissions(user, workspace.id)
        } else {
            return getUserWorkspacePermissionsEager(user, workspace.members)
        }
    }

    static async canUpdateWorkspace(user: SafeUser, workspace: { members: UserWorkspace[] }): Promise<boolean> {
        return getUserWorkspacePermissionsEager(user, workspace.members)
    }
}