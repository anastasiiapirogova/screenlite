import { WorkspaceMembershipWithWorkspaceView } from '@/modules/workspace-member/presentation/view-models/workspace-member-with-workspace.view.ts'
import { WorkspaceMemberWithUserView } from '@/modules/workspace-member/presentation/view-models/workspace-member-with-user.view.ts'
import { WorkspaceMember } from '../../../../core/entities/workspace-member.entity.ts'
import { WorkspaceMembershipsByUserQueryOptionsDTO } from '@/modules/workspace-member/domain/dto/workspace-memberships-by-user-query-options.dto.ts'
import { WorkspaceMembersQueryOptionsDTO } from '@/modules/workspace-member/domain/dto/workspace-members-query-options.dto.ts'
import { PaginationResponse } from '../../../../core/types/pagination.types.ts'

export interface IWorkspaceMemberRepository {
    findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<WorkspaceMember | null>
    countByWorkspace(workspaceId: string): Promise<number>
    save(member: WorkspaceMember): Promise<void>
    delete(memberId: string): Promise<void>
    findWithWorkspaceByUserId(userId: string, queryOptions: WorkspaceMembershipsByUserQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMembershipWithWorkspaceView>>
    countByWorkspaceAndUser(workspaceId: string, userId: string): Promise<number>
    findByWorkspace(queryOptions: WorkspaceMembersQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMemberWithUserView>>
}