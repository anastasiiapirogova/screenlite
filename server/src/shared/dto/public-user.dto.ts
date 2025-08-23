import { UserRole } from '../../core/enums/user-role.enum.ts'

export type PublicUserDTO = {
    id: string
    email: string
    pendingEmail: string | null
    name: string
    role: UserRole
    emailVerifiedAt: Date | null
    profilePhotoPath: string | null
    deletionRequestedAt: Date | null
    deletedAt: Date | null
}