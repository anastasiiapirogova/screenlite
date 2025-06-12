import { useQueryClient } from '@tanstack/react-query'
import { GetPlaylistQueryData } from '../types'
import { playlistQuery } from '../api/queries/playlistQuery'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

export const useSetPlaylistQueryData = () => {
    const queryClient = useQueryClient()
    const workspace = useWorkspace()

    return (playlistId: string, partialData: Partial<GetPlaylistQueryData>) => {
        const query = playlistQuery({
            playlistId,
            workspaceId: workspace.id
        })
        
        queryClient.setQueryData(query.queryKey, (oldData: GetPlaylistQueryData | undefined) => {
            return {
                ...oldData,
                ...partialData
            }
        })
    }
}
