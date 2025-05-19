import { useQueryClient } from '@tanstack/react-query'
import { playlistLayoutQuery } from '../api/queries/playlistLayoutQuery'
import { GetPlaylistLayoutQueryData } from '../types'

export const useSetPlaylistLayoutQueryData = () => {
    const queryClient = useQueryClient()

    return (playlistId: string, partialData: Partial<GetPlaylistLayoutQueryData>) => {
        const query = playlistLayoutQuery(playlistId)
        
        queryClient.setQueryData(query.queryKey, (oldData: GetPlaylistLayoutQueryData | undefined) => {
            return {
                ...oldData,
                ...partialData
            }
        })
    }
}
