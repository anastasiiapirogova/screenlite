export type UserDTO = {
    id: string
    email: string
    name: string
    password: string
    emailVerifiedAt: Date | null
    passwordUpdatedAt: Date | null
    profilePhoto: string | null
    totpSecret: string | null
    twoFactorEnabled: boolean
    deletionRequestedAt: Date | null
    deletedAt: Date | null
} 