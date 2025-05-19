import { UserWorkspace } from '@prisma/client'
import { SafeUser } from 'types.js'
import { getUserWorkspacePermissionsEager } from '../utils/getUserWorkspacePermissions.js'

export class WorkspacePolicy {
    static PERMISSIONS = {
        UPDATE_WORKSPACE: 'update_workspace',
    }

    static async canViewWorkspace(user: SafeUser, workspace: { members: UserWorkspace[] }): Promise<boolean> {
        return getUserWorkspacePermissionsEager(user, workspace.members)
    }

    static async canUpdateWorkspace(user: SafeUser, workspace: { members: UserWorkspace[] }): Promise<boolean> {
        return getUserWorkspacePermissionsEager(user, workspace.members)
    }
}