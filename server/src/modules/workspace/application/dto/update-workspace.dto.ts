import { AuthContext } from '@/core/types/auth-context.type.ts'

export type UpdateWorkspaceDTO = {
    name: string
    slug: string
    pictureBuffer?: Buffer
    removePicture?: boolean
    authContext: AuthContext
}