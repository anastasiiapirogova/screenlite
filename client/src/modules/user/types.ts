export type User = {
	createdAt: string
	deletedAt: string | null
	email: string
	emailVerifiedAt: string | null
	id: string
	name: string
	profilePhoto: string | null
	updatedAt: string
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