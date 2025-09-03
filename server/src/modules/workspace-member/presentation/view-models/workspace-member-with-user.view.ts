export interface WorkspaceMemberWithUserView {
    membershipId: string
    user: {
        id: string
        email: string
        name: string
        profilePhotoPath: string | null
    }
}
