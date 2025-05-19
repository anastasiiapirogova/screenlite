import { WorkspacePlaylistRequestFilters, workspacePlaylistsRequest } from '../requests/workspacePlaylistsRequest'

export const workspacePlaylistsQuery = (
    {
        slug,
        filters
    }: {
		slug: string
		filters: WorkspacePlaylistRequestFilters
	}
) => ({
    queryKey: ['workspacePlaylists', { slug, filters }],
    queryFn: async () => workspacePlaylistsRequest(slug, filters)
})