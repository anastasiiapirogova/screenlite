import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { IWorkspaceRepository } from '@/modules/workspace/domain/ports/workspace-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { IWorkspaceMemberServiceFactory } from '@/modules/workspace-member/domain/services/workspace-member-service.factory.ts'

type LeaveWorkspaceUsecaseDeps = {
    workspaceMemberRepository: IWorkspaceMemberRepository
    workspaceRepository: IWorkspaceRepository
    workspaceMemberServiceFactory: IWorkspaceMemberServiceFactory
    unitOfWork: IUnitOfWork
}

export class LeaveWorkspaceUsecase {
    constructor(private readonly deps: LeaveWorkspaceUsecaseDeps) {}

    async execute(userId: string, workspaceId: string): Promise<void> {
        const { workspaceMemberRepository, workspaceRepository, workspaceMemberServiceFactory, unitOfWork } = this.deps

        const workspace = await workspaceRepository.findById(workspaceId)

        if (!workspace) {
            throw new NotFoundError(`Workspace ${workspaceId} not found`)
        }

        const membership = await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId)

        if (!membership) {
            throw new ForbiddenError({
                workspace: ['ONLY_MEMBER_CAN_LEAVE_WORKSPACE']
            })
        }

        await unitOfWork.execute(async (repos) => {
            const workspaceMemberRepository = repos.workspaceMemberRepository

            const workspaceMemberService = workspaceMemberServiceFactory({
                workspaceMemberRepository,
                userRepository: repos.userRepository,
                workspaceRepository: repos.workspaceRepository
            })

            await workspaceMemberService.removeMember(membership)
        })
    }
}