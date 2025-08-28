export class WorkspaceMemberNotFoundError extends Error {
    constructor(workspaceId: string, userId: string) {
        super(`Member ${userId} not found in workspace ${workspaceId}`)
        this.name = 'WorkspaceMemberNotFoundError'
    }
}