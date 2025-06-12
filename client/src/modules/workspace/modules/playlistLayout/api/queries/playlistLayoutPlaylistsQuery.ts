import { playlistLayoutPlaylistsRequest } from '../requests/playlistLayoutPlaylistsRequest'

export const playlistLayoutPlaylistsQuery = (id: string) => ({
    queryKey: ['playlistLayoutPlaylists', { id }],
    queryFn: async () => playlistLayoutPlaylistsRequest(id)
})