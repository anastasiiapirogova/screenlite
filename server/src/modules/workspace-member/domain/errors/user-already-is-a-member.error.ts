export class UserAlreadyIsAMemberError extends Error {
    constructor(workspaceId: string, userId: string) {
        super(`User ${userId} is already a member of workspace ${workspaceId}`)
        this.name = 'UserAlreadyIsAMemberError'
    }
}