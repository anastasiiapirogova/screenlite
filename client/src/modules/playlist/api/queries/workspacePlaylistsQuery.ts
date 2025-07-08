import { WorkspacePlaylistsRequestData, workspacePlaylistsRequest } from '../requests/workspacePlaylistsRequest'

export const workspacePlaylistsQuery = (data: WorkspacePlaylistsRequestData) => ({
    queryKey: ['workspacePlaylists', data],
    queryFn: async () => workspacePlaylistsRequest(data)
})