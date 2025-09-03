import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'

export interface IWorkspaceMemberService {
    addMember(workspaceId: string, userId: string): Promise<void>
    removeMember(memberId: string): Promise<void>
    findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>
    isMember(workspaceId: string, userId: string): Promise<boolean>
}