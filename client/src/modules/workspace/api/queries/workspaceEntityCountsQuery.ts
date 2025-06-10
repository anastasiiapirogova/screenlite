import { workspaceEntityCountsRequest } from '../requests/workspaceEntityCountsRequest'

export const workspaceEntityCountsQuery = (workspaceId: string) => ({
    queryKey: ['workspaceEntityCounts', { workspaceId }],
    queryFn: async () => workspaceEntityCountsRequest(workspaceId)
})