import { WorkspaceInvitation } from '@/generated/prisma/client.ts'
import { WorkspaceInvitation as DomainWorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'

export class PrismaWorkspaceInvitationMapper {
    static toDomain(member: WorkspaceInvitation): DomainWorkspaceInvitation {
        return new DomainWorkspaceInvitation({
            id: member.id,
            email: member.email,
            status: member.status as WorkspaceInvitationStatus,
            workspaceId: member.workspaceId,
            createdAt: member.createdAt,
        })
    }

    static toPersistence(member: DomainWorkspaceInvitation): Omit<WorkspaceInvitation, 'updatedAt'> {
        return {
            id: member.id,
            email: member.email,
            workspaceId: member.workspaceId,
            status: member.status as WorkspaceInvitationStatus,
            createdAt: member.createdAt,
        }
    }
}