import { screenPlaylistsRequest } from '../requests/screenPlaylistsRequest'

export const screenPlaylistsQuery = (id: string) => ({
    queryKey: ['screenPlaylists', { id }],
    queryFn: async () => screenPlaylistsRequest(id)
})