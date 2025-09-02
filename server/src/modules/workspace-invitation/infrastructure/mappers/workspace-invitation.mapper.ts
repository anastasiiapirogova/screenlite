import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { WorkspaceInvitationDTO } from '@/shared/dto/workspace-invitation.dto.ts'

export class WorkspaceInvitationMapper {
    toDTO(workspaceInvitation: WorkspaceInvitation): WorkspaceInvitationDTO {
        return {
            id: workspaceInvitation.id,
            email: workspaceInvitation.email,
            status: workspaceInvitation.status,
            workspaceId: workspaceInvitation.workspaceId,
            createdAt: workspaceInvitation.createdAt,
        }
    }
}