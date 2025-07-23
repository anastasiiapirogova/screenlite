export type PublicUserDTO = {
    id: string
    email: string
    name: string
    emailVerifiedAt: Date | null
    passwordUpdatedAt: Date | null
    profilePhoto: string | null
    twoFactorEnabled: boolean
    deletionRequestedAt: Date | null
    deletedAt: Date | null
}