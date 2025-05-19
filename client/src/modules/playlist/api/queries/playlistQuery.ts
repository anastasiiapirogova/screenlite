import { playlistRequest } from '../requests/playlistRequest.js'

export const playlistQuery = (id: string) => ({
    queryKey: ['playlist', { id }],
    queryFn: async () => playlistRequest(id)
})