import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { WorkspaceMember } from '@/core/entities/workspace-member.entity.ts'
import { WorkspaceMemberNotFoundError } from '@/modules/workspace-member/domain/errors/workspace-member-not-found.error.ts'
import { LastWorkspaceMemberRemovalError } from '@/modules/workspace-member/domain/errors/last-workspace-member-removal.error.ts'
import { v4 as uuidv4 } from 'uuid'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { UserAlreadyIsAMemberError } from '../errors/user-already-is-a-member.error.ts'

export class WorkspaceMemberService {
    constructor(
        private readonly memberRepository: IWorkspaceMemberRepository,
        private readonly userRepository: IUserRepository,
        private readonly workspaceRepository: IWorkspaceRepository
    ) {}

    private async createMemberEntity(
        workspaceId: string, 
        userId: string, 
    ): Promise<WorkspaceMember> {
        const [user, workspace] = await Promise.all([
            this.userRepository.findById(userId),
            this.workspaceRepository.findById(workspaceId),
        ])
    
        if (!user) throw new NotFoundError(`User ${userId} not found`)
        if (!workspace) throw new NotFoundError(`Workspace ${workspaceId} not found`)
    
        return new WorkspaceMember(uuidv4(), workspaceId, userId)
    }
    
    async addMember(workspaceId: string, userId: string, repository?: IWorkspaceMemberRepository): Promise<void> {
        let existing = null

        if(repository) {
            existing = await repository.findByWorkspaceAndUser(workspaceId, userId)
        } else {
            existing = await this.memberRepository.findByWorkspaceAndUser(workspaceId, userId)
        }

        if (existing) throw new UserAlreadyIsAMemberError(workspaceId, userId)
    
        const member = await this.createMemberEntity(workspaceId, userId)

        await this.memberRepository.save(member)
    }

    async removeMember(workspaceId: string, userId: string): Promise<void> {
        const member = await this.findMember(workspaceId, userId)

        if (!member) {
            throw new WorkspaceMemberNotFoundError(workspaceId, userId)
        }

        const memberCount = await this.memberRepository.countByWorkspace(workspaceId)

        if (memberCount <= 1) {
            throw new LastWorkspaceMemberRemovalError()
        }

        await this.memberRepository.delete(member.id)
    }

    async findMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
        return this.memberRepository.findByWorkspaceAndUser(workspaceId, userId)
    }
}