import { useQueryClient } from '@tanstack/react-query'
import { workspaceEntityCountsQuery } from '../api/queries/workspaceEntityCountsQuery'
import { useWorkspace } from './useWorkspace'

export const useRefetchWorkspaceEntityCounts = () => {
    const queryClient = useQueryClient()
    const workspace = useWorkspace()

    return () => {
        const query = workspaceEntityCountsQuery(workspace.id)
        
        queryClient.refetchQueries(query)
    }
}
