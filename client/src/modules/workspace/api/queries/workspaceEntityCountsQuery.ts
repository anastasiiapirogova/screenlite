import { workspaceEntityCountsRequest } from '../requests/workspaceEntityCountsRequest'

export const workspaceEntityCountsQuery = (slug: string) => ({
    queryKey: ['workspaceEntityCounts', { slug }],
    queryFn: async () => workspaceEntityCountsRequest(slug)
})