import { playlistScreensRequest } from '../requests/playlistScreensRequest.js'

export const playlistScreensQuery = (id: string) => ({
    queryKey: ['playlistScreens', { id }],
    queryFn: async () => playlistScreensRequest(id)
})