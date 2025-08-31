import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { GetWorkspacesDto } from '../dto/get-workspaces.dto.ts'
import { WorkspaceListPolicy } from '../../domain/policies/workspace-list.policy.ts'

export class GetWorkspacesUsecase {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
    ) {}

    async execute(dto: GetWorkspacesDto) {
        WorkspaceListPolicy.enforceViewAllWorkspaces(dto.authContext)

        return this.workspaceRepository.findAll(dto.queryOptions)
    }
}