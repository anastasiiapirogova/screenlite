import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'
import { WorkspaceMemberDTO } from '../../domain/dto/workspace-member.dto.ts'

export class WorkspaceMemberMapper {
    toDTO(member: WorkspaceMember): WorkspaceMemberDTO {
        return {
            id: member.id,
            workspaceId: member.workspaceId,
            userId: member.userId,
        }
    }
}