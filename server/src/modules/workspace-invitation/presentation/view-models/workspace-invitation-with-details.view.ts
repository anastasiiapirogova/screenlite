export type WorkspaceInvitationUserInvitor = {
    type: 'user'
    id: string
    name: string
    profilePhotoPath: string | null
}

export interface WorkspaceInvitationWithDetailsView {
    invitationId: string
    email: string
    status: string
    createdAt: Date
    workspace: {
        id: string
        name: string
        slug: string
        status: string
        picturePath: string | null
    }
    invitor: WorkspaceInvitationUserInvitor | null
}