import { SafeUser } from 'types.js'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.js'
import { isUserMemberOfWorkspace } from './isUserMemberOfWorkspace.js'
import { UserWorkspace } from '@prisma/client'

/**
 * Determines if a user has permissions in a specified workspace.
 * 
 * Currently, this function checks if the user is a member of the workspace.
 * In the future, it will be extended to retrieve the user's permissions within the workspace.
 */
export const getUserWorkspacePermissions = async (user: SafeUser, workspaceId: string | undefined): Promise<boolean> => {
    if(!workspaceId) return false

    const workspace = await WorkspaceRepository.getWithMember(workspaceId, user.id)

    if (!workspace) return false

    return isUserMemberOfWorkspace(user.id, workspace.members)
}

export const getUserWorkspacePermissionsEager = async (user: SafeUser, workspaceUsers: UserWorkspace[]): Promise<boolean> => {
    return isUserMemberOfWorkspace(user.id, workspaceUsers)
}