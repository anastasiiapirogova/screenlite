import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'

export interface IWorkspaceInvitationService {
    inviteUser(params: {
        workspaceId: string
        email: string
        initiatorId: string
    }): Promise<WorkspaceInvitation>
    
    respondToInvitation(invitation: WorkspaceInvitation, accept: boolean, userId: string): Promise<WorkspaceInvitation>

    cancelInvitation(invitation: WorkspaceInvitation): Promise<WorkspaceInvitation>
}