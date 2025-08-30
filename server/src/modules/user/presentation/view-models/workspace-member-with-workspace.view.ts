export interface WorkspaceMembershipWithWorkspaceView {
    membershipId: string
    workspace: {
        id: string
        name: string
        slug: string
        picturePath: string | null
    }
}