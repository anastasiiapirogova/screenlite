export type WorkspaceRole = 'owner' | 'admin' | 'member'

export type AddMemberData = {
    workspaceId: string
    userId: string
    workspaceInvitationId: string
    permissions: string[]
    role?: WorkspaceRole
}