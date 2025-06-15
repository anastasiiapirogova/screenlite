import { workspacePlaylistLayoutsRequest, WorkspacePlaylistLayoutsRequestData } from '../requests/workspacePlaylistLayoutsRequest'

export const workspacePlaylistLayoutsQuery = (data: WorkspacePlaylistLayoutsRequestData) => ({
    queryKey: ['workspacePlaylistLayouts', data],
    queryFn: async () => workspacePlaylistLayoutsRequest(data)
})