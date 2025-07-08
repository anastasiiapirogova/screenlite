import { playlistRequest, PlaylistRequestData } from '../requests/playlistRequest.js'

export const playlistQuery = (data: PlaylistRequestData) => ({
    queryKey: ['playlist', data],
    queryFn: async () => playlistRequest(data)
})