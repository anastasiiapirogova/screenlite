import { AuthContext } from '@/core/types/auth-context.type.ts'

export type UpdateProfileDto = {
    userId: string
    name: string
    profilePhotoBuffer?: Buffer
    removeProfilePhoto?: boolean
    authContext: AuthContext
}