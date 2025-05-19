import { $Enums, User } from '@prisma/client'

export type SafeUser = Omit<User, 'password'>

export type GracefulShutdown = {
	(signal: string): Promise<void>
}

export type ComparablePlaylistItem = {
	id: string
	type: $Enums.PlaylistItemType
	duration: number | null
	playlistLayoutSectionId: string
	fileId: string | null
	nestedPlaylistId: string | null
	order: number
}