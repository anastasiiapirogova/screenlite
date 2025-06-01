import { Workspace } from '@modules/workspace/types'

export type User = {
	name: string
    id: string
    email: string
    emailVerifiedAt: Date | null
    profilePhoto: string | null
    twoFactorEnabled: boolean
	hasPassedTwoFactorAuth?: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export type UserSession = {
	id: string
	createdAt: string
	ipAddress: string
	userAgent: string
	userId: string
	revokedAt: string | null
	lastActivityAt: string
}

export type UserInvitation = {
	id: string
    email: string
    status: string
    createdAt: string
    workspace: Workspace
}