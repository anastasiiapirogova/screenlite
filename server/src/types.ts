import { User } from '@/generated/prisma/client.ts'

export type SafeUser = Omit<User, 'password' | 'totpSecret'>

export type AuthUser = SafeUser & {
	hasPassedTwoFactorAuth: boolean
}

export interface AuthRequest extends Request {
	user: AuthUser
}

export type GracefulShutdown = {
	(signal: string): Promise<void>
}

export type ComparablePlaylistItem = {
	id: string
	type: string
	duration: number | null
	playlistLayoutSectionId: string
	fileId: string | null
	nestedPlaylistId: string | null
	order: number
}

export type PaginationMeta = {
	page: number
	limit: number
	pages?: number
	total: number
}