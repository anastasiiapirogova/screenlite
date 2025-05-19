import { playlistLayoutRequest } from '../requests/playlistLayoutRequest'

export const playlistLayoutQuery = (id: string) => ({
    queryKey: ['playlistLayout', { id }],
    queryFn: async () => playlistLayoutRequest(id)
})