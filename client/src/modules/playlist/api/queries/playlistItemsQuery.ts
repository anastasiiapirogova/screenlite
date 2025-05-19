import { playlistItemsRequest } from '../requests/playlistItemsRequest.js'

export const playlistItemsQuery = (id: string) => ({
    queryKey: ['playlistItems', { id }],
    queryFn: async () => playlistItemsRequest(id),
})