import { Workspace } from '@modules/workspace/types'

export type User = {
	name: string
    id: string
    email: string
    emailVerifiedAt: string | null
    profilePhoto: string | null
    twoFactorEnabled: boolean
	hasPassedTwoFactorAuth?: boolean
	passwordUpdatedAt?: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export type UserInvitation = {
	id: string
    email: string
    status: string
    createdAt: string
    workspace: Workspace
}