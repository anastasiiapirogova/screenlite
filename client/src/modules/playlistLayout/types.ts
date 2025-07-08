import { Playlist } from '@modules/playlist/types'

export type PlaylistLayout = {
	id: string
	workspaceId: string
	name: string
	resolutionWidth: number
	resolutionHeight: number
	sections: PlaylistLayoutSection[]
	createdAt: string
	updatedAt: string
	_count: {
		playlists: number
	}
}

export type PlaylistLayoutListItem = Omit<PlaylistLayout, 'sections'>

export type PlaylistLayoutSection = {
	id: string
	playlistLayoutId: string
	name: string
	top: number
	left: number
	width: number
	height: number
	zIndex: number
};

export type CreatePlaylistLayoutRequestData = {
	workspaceId: string
	name: string
	resolutionWidth: number
	resolutionHeight: number
}

export type GetPlaylistLayoutQueryData = PlaylistLayout

export type PlaylistLayoutPlaylist = Pick<Playlist, 'id' | 'name' | 'type' | 'isPublished' | 'description' | 'createdAt' | 'updatedAt'>