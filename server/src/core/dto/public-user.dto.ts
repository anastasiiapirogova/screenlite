import { UserRole } from '../enums/user-role.enum.ts'

export type PublicUserDTO = {
    id: string
    email: string
    pendingEmail: string | null
    name: string
    role: UserRole
    emailVerifiedAt: Date | null
    passwordUpdatedAt: Date | null
    profilePhoto: string | null
    twoFactorEnabled: boolean
    deletionRequestedAt: Date | null
    deletedAt: Date | null
}