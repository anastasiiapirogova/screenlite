import { useQueryClient } from '@tanstack/react-query'
import { GetPlaylistLayoutQueryData } from '../types'
import { playlistLayoutQuery } from '../api/playlistLayout'

export const useSetPlaylistLayoutQueryData = () => {
    const queryClient = useQueryClient()

    return (playlistLayoutId: string, workspaceId: string, partialData: Partial<GetPlaylistLayoutQueryData>) => {
        const query = playlistLayoutQuery({
            playlistLayoutId,
            workspaceId
        })
        
        queryClient.setQueryData(query.queryKey, (oldData: GetPlaylistLayoutQueryData | undefined) => {
            return {
                ...oldData,
                ...partialData
            }
        })
    }
}