import { getUserWorkspacePermissions } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { SafeUser } from 'types.js'

export const memberPolicy = {
    canViewMembers: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
}