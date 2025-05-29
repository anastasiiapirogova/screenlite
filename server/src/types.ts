import { User } from 'generated/prisma/client.js'

export type SafeUser = Omit<User, 'password'>

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