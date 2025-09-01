import { WorkspaceMember } from '@/generated/prisma/client.ts'
import { WorkspaceMember as DomainWorkspaceMember } from '@/core/entities/workspace-member.entity.ts'

export class PrismaWorkspaceMemberMapper {
    static toDomain(member: WorkspaceMember): DomainWorkspaceMember {
        return new DomainWorkspaceMember(member.id, member.workspaceId, member.userId)
    }

    static toPersistence(member: DomainWorkspaceMember): WorkspaceMember {
        return {
            id: member.id,
            workspaceId: member.workspaceId,
            userId: member.userId,
        }
    }
}