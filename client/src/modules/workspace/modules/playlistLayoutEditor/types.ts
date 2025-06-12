import { PlaylistLayoutSection } from '@modules/workspace/modules/playlistLayout/types'

export type PlaylistLayoutEditorLayoutSection = PlaylistLayoutSection & {
	top: number | string
	left: number | string
	width: number | string
	height: number | string
}
