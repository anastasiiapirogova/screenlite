import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'
import { v4 as uuidv4 } from 'uuid'
import { UserAlreadyIsAMemberError } from '../errors/user-already-is-a-member.error.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IWorkspaceMemberService } from '../ports/workspace-member-service.interface.ts'

export class WorkspaceMemberService implements IWorkspaceMemberService {
    constructor(
        private readonly memberRepository: IWorkspaceMemberRepository,
        private readonly userRepository: IUserRepository,
        private readonly workspaceRepository: IWorkspaceRepository
    ) {}

    private async createMemberEntity(
        workspaceId: string, 
        userId: string, 
    ): Promise<WorkspaceMember> {
        return new WorkspaceMember(uuidv4(), workspaceId, userId)
    }
    
    async addMember(workspaceId: string, userId: string): Promise<void> {
        const [user, workspace] = await Promise.all([
            this.userRepository.findById(userId),
            this.workspaceRepository.findById(workspaceId),
        ])

        if (!user) throw new NotFoundError(`User ${userId} not found`)
        if (!workspace) throw new NotFoundError(`Workspace ${workspaceId} not found`)

        const existing = await this.findMember(workspaceId, userId)

        if (existing) throw new UserAlreadyIsAMemberError(workspaceId, userId)
    
        const member = await this.createMemberEntity(workspaceId, userId)

        await this.memberRepository.save(member)
    }

    async removeMember(member: WorkspaceMember): Promise<void> {
        await this.memberRepository.delete(member.id)
    }

    async findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
        return this.memberRepository.findByWorkspaceAndUser(workspaceId, userId)
    }

    async isMember(workspaceId: string, userId: string): Promise<boolean> {
        const count = await this.memberRepository.countByWorkspaceAndUser(workspaceId, userId)

        return count > 0
    }
}