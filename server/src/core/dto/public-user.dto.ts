export type PublicUserDTO = {
    id: string
    email: string
    name: string
    emailVerifiedAt: Date | null
    passwordUpdatedAt: Date | null
    profilePhoto: string | null
    twoFactorEnabled: boolean
    deletedAt: Date | null
}