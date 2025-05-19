import { useQueryClient } from '@tanstack/react-query'
import { GetPlaylistQueryData } from '../types'
import { playlistQuery } from '../api/queries/playlistQuery'

export const useSetPlaylistQueryData = () => {
    const queryClient = useQueryClient()

    return (playlistId: string, partialData: Partial<GetPlaylistQueryData>) => {
        const query = playlistQuery(playlistId)
        
        queryClient.setQueryData(query.queryKey, (oldData: GetPlaylistQueryData | undefined) => {
            return {
                ...oldData,
                ...partialData
            }
        })
    }
}
