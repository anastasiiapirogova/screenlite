import { useQueryClient } from '@tanstack/react-query'
import { workspaceStatisticsQuery } from '../api/requests/workspaceStatisticsRequest'
import { useWorkspace } from './useWorkspace'

export const useRefetchWorkspaceStatistics = () => {
    const queryClient = useQueryClient()
    const workspace = useWorkspace()

    return () => {
        const query = workspaceStatisticsQuery(workspace.id)
        
        queryClient.refetchQueries(query)
    }
}
