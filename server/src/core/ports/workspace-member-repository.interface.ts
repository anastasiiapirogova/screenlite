import { WorkspaceMember } from '../entities/workspace-member.entity.ts'

export interface IWorkspaceMemberRepository {
    findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<WorkspaceMember | null>
    countByWorkspace(workspaceId: string): Promise<number>
    save(member: WorkspaceMember): Promise<void>
    delete(memberId: string): Promise<void>
}