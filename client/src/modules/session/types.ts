export type UserSession = {
	id: string
	createdAt: string
	ipAddress: string
	userAgent: string
	userId: string
	terminatedAt: string | null
	lastActivityAt: string
	token?: string
}