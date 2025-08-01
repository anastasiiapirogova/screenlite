import { UserRole } from '../enums/user-role.enum.ts'

export type UserDTO = {
    id: string
    email: string
    pendingEmail: string | null
    name: string
    passwordHash: string
    role: UserRole
    emailVerifiedAt: Date | null
    passwordUpdatedAt: Date | null
    profilePhoto: string | null
    totpSecret: string | null
    twoFactorEnabled: boolean
    deletionRequestedAt: Date | null
    deletedAt: Date | null
    version: number
}