import { IWorkspaceRepository } from '../ports/workspace-repository.interface.ts'
import { WorkspaceCreationService } from './workspace-creation.service.ts'

export type WorkspaceCreationServiceFactory = (deps: {
    workspaceRepository: IWorkspaceRepository
}) => WorkspaceCreationService

export const workspaceCreationServiceFactory: WorkspaceCreationServiceFactory = (deps) => {
    return new WorkspaceCreationService(
        deps.workspaceRepository
    )
}