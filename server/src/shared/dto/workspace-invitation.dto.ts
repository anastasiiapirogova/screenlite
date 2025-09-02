export interface WorkspaceInvitationDTO {
    id: string
    email: string
    status: string
    workspaceId: string
    initiatorId: string
    createdAt: Date
}