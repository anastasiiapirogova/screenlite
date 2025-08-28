export class LastWorkspaceMemberRemovalError extends Error {
    constructor() {
        super('Cannot remove the last member of the workspace.')
        this.name = 'LastWorkspaceMemberRemovalError'
    }
}