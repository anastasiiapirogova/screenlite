import { GetWorkspacesDto } from '../dto/get-workspaces.dto.ts'
import { WorkspaceListPolicy } from '../../domain/policies/workspace-list.policy.ts'
import { IWorkspacesQuery } from '../../domain/ports/workspaces-query.interface.ts'

export class GetWorkspacesUsecase {
    constructor(
        private readonly workspacesQuery: IWorkspacesQuery,
    ) {}

    async execute(dto: GetWorkspacesDto) {
        WorkspaceListPolicy.enforceViewAllWorkspaces(dto.authContext)

        return this.workspacesQuery.handle(dto.queryOptions)
    }
}