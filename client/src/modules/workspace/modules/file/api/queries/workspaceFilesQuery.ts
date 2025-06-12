import { workspaceFilesRequest, WorkspaceFilesRequestData } from '../requests/workspaceFilesRequest'

export const workspaceFilesQuery = (
    data: WorkspaceFilesRequestData
) => ({
    queryKey: ['workspaceFiles', data],
    queryFn: async () => workspaceFilesRequest(data)
})