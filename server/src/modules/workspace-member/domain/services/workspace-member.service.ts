import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'
import { LastWorkspaceMemberRemovalError } from '@/modules/workspace-member/domain/errors/last-workspace-member-removal.error.ts'
import { v4 as uuidv4 } from 'uuid'
import { UserAlreadyIsAMemberError } from '../errors/user-already-is-a-member.error.ts'

export class WorkspaceMemberService {
    constructor(
        private readonly memberRepository: IWorkspaceMemberRepository,
    ) {}

    private async createMemberEntity(
        workspaceId: string, 
        userId: string, 
    ): Promise<WorkspaceMember> {
        return new WorkspaceMember(uuidv4(), workspaceId, userId)
    }
    
    async addMember(workspaceId: string, userId: string): Promise<void> {
        const existing = await this.findMember(workspaceId, userId)

        if (existing) throw new UserAlreadyIsAMemberError(workspaceId, userId)
    
        const member = await this.createMemberEntity(workspaceId, userId)

        await this.memberRepository.save(member)
    }

    async removeMember(member: WorkspaceMember): Promise<void> {
        const memberCount = await this.memberRepository.countByWorkspace(member.workspaceId)

        if (memberCount <= 1) {
            throw new LastWorkspaceMemberRemovalError()
        }

        await this.memberRepository.delete(member.id)
    }

    async findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
        return this.memberRepository.findByWorkspaceAndUser(workspaceId, userId)
    }
}