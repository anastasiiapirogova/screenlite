import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'

export interface IWorkspaceInvitationService {
    inviteUser(params: {
        workspaceId: string
        email: string
    }): Promise<WorkspaceInvitation>
    
    respondToInvitation(invitation: WorkspaceInvitation, accept: boolean, userId: string): Promise<void>

    cancelInvitation(invitation: WorkspaceInvitation): Promise<void>
}