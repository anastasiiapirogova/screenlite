import { WorkspaceMembershipWithWorkspaceView } from '@/modules/user/presentation/view-models/workspace-member-with-workspace.view.ts'
import { WorkspaceMember } from '../entities/workspace-member.entity.ts'
import { UserWorkspacesQueryOptionsDTO } from '@/modules/user/domain/dto/user-workspaces-query-options.dto.ts'
import { PaginationResponse } from '../types/pagination.types.ts'

export interface IWorkspaceMemberRepository {
    findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<WorkspaceMember | null>
    countByWorkspace(workspaceId: string): Promise<number>
    save(member: WorkspaceMember): Promise<void>
    delete(memberId: string): Promise<void>
    findWithWorkspaceByUserId(userId: string, queryOptions: UserWorkspacesQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMembershipWithWorkspaceView>>
}