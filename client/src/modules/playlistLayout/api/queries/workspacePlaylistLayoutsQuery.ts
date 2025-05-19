import { workspacePlaylistLayoutsRequest, WorkspacePlaylistLayoutsRequestFilters } from '../requests/workspacePlaylistLayoutsRequest'

export const workspacePlaylistLayoutsQuery = (
    slug: string,
    filters: WorkspacePlaylistLayoutsRequestFilters
) => ({
    queryKey: ['workspacePlaylistLayouts', { slug, filters }],
    queryFn: async () => workspacePlaylistLayoutsRequest(slug, filters)
})